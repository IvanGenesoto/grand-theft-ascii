import express, {static as static_} from 'express'
import {Server} from 'http'
import socketIo from 'socket.io'
import {join} from 'path'
import now from 'performance-now'
import {getCityKit} from './get-city-kit'
import {getEntityKit} from './get-entity-kit'
import {getPlayerKit} from './get-player-kit'

const app = express()
const server = Server(app)
const io = socketIo(server)
const port = process.env.PORT || 3000

const state = {
  tick: 0,
  elementCount: 0,
  layerY: 0,
  fps: 30,
  connectionQueue: [],
  latencyQueue: [],
  inputQueue: [],
  delayKit: {},
  cityKit: getCityKit(),
  entityKit: getEntityKit(),
  playerKit: getPlayerKit(),
  _players: [],
  _entities: [],
  now
}

const createMayor = state => {
  const {_players, playerKit, entityKit} = state
  const player = playerKit.create(_players)
  const {id: playerId} = player
  const character = entityKit.create('character', state)
  const {id: characterId} = character
  player.characterId = characterId
  character.playerId = playerId
  return state
}

const initiate = function (characterCount, vehicleCount) {
  const {state} = this
  const {cityKit} = state
  state.city = cityKit.createCity(state)
  state.grid = createGrid()
  populate.call(this, 'character', characterCount)
  populate.call(this, 'vehicle', vehicleCount)
  return state
}

const createGrid = () => {
  const grid = {}
  let rowCount = -1
  while (rowCount < 8) {
    ++rowCount
    const rowId = getGridIndex(rowCount * 1000)
    const row = grid[rowId] = {}
    let sectionCount = -1
    while (sectionCount < 32) {
      ++sectionCount
      const sectionId = getGridIndex(sectionCount * 1000)
      const section = row[sectionId] = {}
      section.a = []
      section.b = []
    }
  }
  return grid
}

const getGridIndex = coordinate => {
  coordinate = Math.round(coordinate)
  coordinate = coordinate.toString()
  const {length} = coordinate
  let zerosToAdd = 5 - length
  let zeros = ''
  while (zerosToAdd > 0) zeros += '0' && --zerosToAdd
  coordinate = zeros + coordinate
  return coordinate.slice(0, 2)
}

const populate = function (entityType, count) {
  const {state} = this
  const {entityKit} = state
  while (count) entityKit.create(entityType, state) && --count
  return state
}

const handleConnection = function (socket) {
  const {state} = this
  const {connectionQueue} = state
  const wrappedPlayer = {}
  connectionQueue.push({socket, wrappedPlayer})
  socket.on('timestamp', handleTimestamp.bind({state, wrappedPlayer}))
  socket.on('input', handleInput.bind({state, wrappedPlayer}))
  return state
}

const handleTimestamp = function (timestamp) {
  const {state, wrappedPlayer} = this
  const {latencyQueue} = state
  const newTimestamp = now()
  const latency = newTimestamp - timestamp
  latencyQueue.push({latency, wrappedPlayer})
  return state
}

const handleInput = function (input) {
  const {state, wrappedPlayer} = this
  const {inputQueue} = state
  inputQueue.push({input, wrappedPlayer})
  return state
}

const refresh = state => {
  const {_players, _entities, playerKit, entityKit} = state
  const tick = ++state.tick
  state.refreshingStartTime = now()
  runQueues.call({state})
  const playerCharacters = _players.map(({characterId}) => _entities[characterId])
  const {actives} = playerCharacters.reduce(pushIfActive, {_players, actives: []})
  const activesByCategory = {walkers: [], drivers: [], passengers: []}
  const {walkers, drivers, passengers} = actives.reduce(categorize, activesByCategory)
  const vehicles = _entities.filter(({type}) => type === 'vehicle')
  walkers.reduce(enterIfCan, vehicles)
  passengers.reduce(entityKit.exitVehicle, _entities)
  drivers.reduce(entityKit.exitVehicle, _entities)
  const charactersByCategory = {walkers: [], drivers: [], passengers: []}
  const args = [categorize, charactersByCategory]
  const {walkers: walkers_, drivers: drivers_} = playerCharacters.reduce(...args)
  walkers_.forEach(walk, {_players})
  drivers_.forEach(drive, {state})
  _entities.forEach(entityKit.updateLocation, {state})
  if (tick % 3) return deferRefresh(state)
  const latencyKits = playerKit.getLatencyKits(_players)
  latencyKits.forEach(entityKit.updateLatencies, {_entities})
  entityKit.emit(io, _entities)
  deferRefresh(state)
  return state
}

const pushIfActive = (activeKit, character, index) => {
  const {_players, actives} = activeKit
  const player = _players[index]
  const {input, previousAction} = player
  const {action} = input
  const isActive = action && !previousAction
  player.previousAction = action
  isActive && actives.push(character)
  return activeKit
}

const categorize = (activesByCategory, character) => {
  const {walkers, drivers, passengers} = activesByCategory
  const {drivingId, passengingId} = character
  const entities =
      drivingId ? drivers
    : passengingId ? passengers
    : walkers
  entities.push(character)
  return activesByCategory
}

const enterIfCan = (vehicles, walker) => {
  const vehicle = vehicles.find(canVehicleBeEntered, {walker})
  if (!vehicle) return vehicles
  enter(vehicle, walker)
  return vehicles
}

const canVehicleBeEntered = function (vehicle) {
  const {walker} = this
  const {driverId, passengerIds, seatCount} = vehicle
  const {length: passengerCount} = passengerIds
  const driverCount = driverId ? 1 : 0
  if (driverCount + passengerCount >= seatCount) return false
  return isVehicleTouchingCharacter(vehicle, walker)
}

const isVehicleTouchingCharacter = (vehicle, character) =>
     character.x < vehicle.x + vehicle.width
  && character.x + character.width > vehicle.x
  && character.y < vehicle.y + vehicle.height
  && character.y + character.height > vehicle.y

const enter = (vehicle, character) => {
  const {id: characterId} = character
  const {id: vehicleId, driverId, passengerIds} = vehicle
  driverId || (vehicle.driverId = characterId)
  if (!driverId) return (character.drivingId = vehicleId) && {vehicle, character}
  character.passengingId = vehicleId
  passengerIds.push(characterId)
  return {vehicle, character}
}

const walk = function (character) {
  const {_players} = this
  const {playerId, direction, maxSpeed} = character
  const player = _players[playerId]
  const {input} = player
  const {right, left} = input
  character.speed = right || left ? maxSpeed : 0
  character.direction =
      right ? 'right'
    : left ? 'left'
    : direction
  return character
}

const drive = function (character) {
  const {state} = this
  const {_players, _entities} = state
  const {playerId, drivingId: vehicleId} = character
  const player = _players[playerId]
  const {input} = player
  const vehicle = _entities[vehicleId]
  const {direction, speed, maxSpeed, acceleration, deceleration} = vehicle
  const newDirection = getNewDirection(input)
  const isAccelerating = newDirection === direction
  const isDecelerating = speed && isVehicleDecelerating(direction, newDirection)
  const isTurning = isVehicleTurning(direction, newDirection)
  const isStrafing = isVehicleStrafing(direction, newDirection)
  direction !== 'up' && direction !== 'down' && (vehicle.previousDirection = direction)
  vehicle.direction = !isDecelerating && newDirection ? newDirection : direction
  isTurning && (vehicle.speed /= 4)
  isStrafing && (vehicle.speed *= 0.9)
  isAccelerating && (vehicle.speed += acceleration)
  isDecelerating && (vehicle.speed -= deceleration)
  vehicle.speed > maxSpeed && (vehicle.speed = maxSpeed)
  vehicle.speed < 0 && (vehicle.speed = 0)
  vehicle.speed < 2 && !isAccelerating && (vehicle.speed = 0)
  return state
}

const getNewDirection = ({up, down, left, right}) =>
    up && left ? 'up-left'
  : up && right ? 'up-right'
  : down && left ? 'down-left'
  : down && right ? 'down-right'
  : up ? 'up'
  : down ? 'down'
  : left ? 'left'
  : right ? 'right'
  : null

const isVehicleDecelerating = (direction, newDirection) =>
     (direction === 'up' && newDirection === 'down')
  || (direction === 'up' && newDirection === 'down-left')
  || (direction === 'up' && newDirection === 'down-right')
  || (direction === 'up-right' && newDirection === 'down-left')
  || (direction === 'up-right' && newDirection === 'left')
  || (direction === 'up-right' && newDirection === 'down')
  || (direction === 'right' && newDirection === 'left')
  || (direction === 'right' && newDirection === 'up-left')
  || (direction === 'right' && newDirection === 'down-left')
  || (direction === 'down-right' && newDirection === 'up-left')
  || (direction === 'down-right' && newDirection === 'up')
  || (direction === 'down-right' && newDirection === 'left')
  || (direction === 'down' && newDirection === 'up')
  || (direction === 'down' && newDirection === 'up-right')
  || (direction === 'down' && newDirection === 'up-left')
  || (direction === 'down-left' && newDirection === 'up-right')
  || (direction === 'down-left' && newDirection === 'right')
  || (direction === 'down-left' && newDirection === 'up')
  || (direction === 'left' && newDirection === 'right')
  || (direction === 'left' && newDirection === 'down-right')
  || (direction === 'left' && newDirection === 'up-right')
  || (direction === 'up-left' && newDirection === 'down-right')
  || (direction === 'up-left' && newDirection === 'down')
  || (direction === 'up-left' && newDirection === 'right')

const isVehicleTurning = (direction, newDirection) =>
     (direction === 'up' && newDirection === 'left')
  || (direction === 'up' && newDirection === 'right')
  || (direction === 'up' && newDirection === 'up-left')
  || (direction === 'up' && newDirection === 'up-right')
  || (direction === 'up-right' && newDirection === 'up-left')
  || (direction === 'up-right' && newDirection === 'down-right')
  || (direction === 'right' && newDirection === 'up')
  || (direction === 'right' && newDirection === 'down')
  || (direction === 'down-right' && newDirection === 'up-right')
  || (direction === 'down-right' && newDirection === 'down-left')
  || (direction === 'down' && newDirection === 'right')
  || (direction === 'down' && newDirection === 'left')
  || (direction === 'down' && newDirection === 'down-right')
  || (direction === 'down' && newDirection === 'down-left')
  || (direction === 'down-left' && newDirection === 'down-right')
  || (direction === 'down-left' && newDirection === 'up-left')
  || (direction === 'left' && newDirection === 'down')
  || (direction === 'left' && newDirection === 'up')
  || (direction === 'up-left' && newDirection === 'down-left')
  || (direction === 'up-left' && newDirection === 'up-right')

const isVehicleStrafing = (direction, newDirection) =>
     (direction === 'up-right' && newDirection === 'up')
  || (direction === 'up-right' && newDirection === 'right')
  || (direction === 'right' && newDirection === 'up-right')
  || (direction === 'right' && newDirection === 'down-right')
  || (direction === 'down-right' && newDirection === 'right')
  || (direction === 'down-right' && newDirection === 'down')
  || (direction === 'down-left' && newDirection === 'down')
  || (direction === 'down-left' && newDirection === 'left')
  || (direction === 'left' && newDirection === 'down-left')
  || (direction === 'left' && newDirection === 'up-left')
  || (direction === 'up-left' && newDirection === 'left')
  || (direction === 'up-left' && newDirection === 'up')

const deferRefresh = state => {
  const {delayKit, fps, now, refreshingStartTime} = state
  const millisecondsPerFrame = 1000 / fps
  const refreshWithState = refresh.bind(null, state)
  delayKit.loopStartTime || (delayKit.loopStartTime = now() - millisecondsPerFrame)
  delayKit.millisecondsAhead || (delayKit.millisecondsAhead = 0)
  const refreshDuration = now() - refreshingStartTime
  const loopDuration = now() - delayKit.loopStartTime
  const delayDuration = loopDuration - refreshDuration
  delayKit.loopStartTime = now()
  delayKit.shouldCheckForSlowdown && compensateIfShould(delayDuration, delayKit)
  delayKit.millisecondsAhead += millisecondsPerFrame - loopDuration
  delayKit.delay = millisecondsPerFrame + delayKit.millisecondsAhead - refreshDuration
  clearTimeout(delayKit.timeoutId)
  if (delayKit.delay < 5) return (delayKit.shouldCheckForSlowdown = false) || refreshWithState()
  if (!delayKit.hasSlowdown) {
    delayKit.shouldCheckForSlowdown = true
    delayKit.timeoutId = setTimeout(refreshWithState, delayKit.delay - 2)
    return
  }
  delayKit.delay *= delayKit.slowdownCompensation
  if (delayKit.delay >= 14) {
    delayKit.shouldCheckForSlowdown = true
    delayKit.hasSlowdown = false
    delayKit.timeoutId = setTimeout(refreshWithState, delayKit.delay - 2)
    return
  }
  if (delayKit.delay < 7) return refreshWithState()
  delayKit.shouldCheckForSlowdown = true
  delayKit.hasSlowdown = false
  delayKit.timeoutId = setTimeout(refreshWithState, 0)
}

const compensateIfShould = (delayDuration, delayKit) =>
     delayDuration > delayKit.delay * 1.2
  && (delayKit.hasSlowdown = true)
  && (delayKit.slowdownCompensation = delayKit.delay / delayDuration)

const runQueues = function () {
  const {state} = this
  const {playerKit, connectionQueue, latencyQueue, inputQueue} = state
  const {updateLatencyBuffer, updateInput} = playerKit
  connectionQueue.forEach(initiatePlayer, this)
  latencyQueue.forEach(updateLatencyBuffer)
  inputQueue.forEach(updateInput, this)
  connectionQueue.length = 0
  latencyQueue.length = 0
  inputQueue.length = 0
  return state
}

const initiatePlayer = function ({socket, wrappedPlayer}) {
  const {state} = this
  const {_players, playerKit, entityKit, city} = state
  const {id: socketId} = socket
  const player = wrappedPlayer.player = playerKit.create(_players, socketId)
  const {id: playerId} = player
  const character = entityKit.create('character', state)
  const {id: characterId} = character
  player.characterId = characterId
  character.playerId = playerId
  const {x: characterX} = character
  const vehicleX = getVehicleX(characterX)
  const configuration = {x: vehicleX, y: 7843, speed: 0}
  const vehicle = entityKit.create('vehicle', state, configuration)
  socket.emit('player', player)
  socket.emit('city', city)
  io.emit('entity', character)
  io.emit('entity', vehicle)
  return state
}

const getVehicleX = function (characterX) {
  const distance = Math.random() * (1000 - 200) + 200
  const sides = ['left', 'right']
  const random = Math.random()
  const index = Math.floor(random * sides.length)
  const side = sides[index]
  return side === 'left' ? characterX - distance : characterX + distance
}

createMayor(state)
initiate.call({state}, 20, 40)
io.on('connection', handleConnection.bind({state}))
app.use(static_(join(__dirname, 'public')))
server.listen(port, () => console.log('Listening on port ' + port))
refresh(state)
