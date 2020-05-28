import express, {static as static_} from 'express'
import {Server} from 'http'
import socketIo from 'socket.io'
import {join} from 'path'
import now from 'performance-now'
import {getDistrictKit} from './get-district-kit'
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
  districtKit: getDistrictKit(),
  entityKit: getEntityKit(),
  playerKit: getPlayerKit(),
  _players: [],
  _districts: [],
  _entities: [],
  now
}

const createMayor = state => {
  const {_players, _entities, playerKit, entityKit, districtKit} = state
  const player = playerKit.create(_players)
  const {id: playerId} = player
  const character = entityKit.create('character', _entities)
  const {id: characterId} = character
  const district = districtKit.create(state, true)
  const {id: districtId} = district
  player.characterId = characterId
  character.playerId = playerId
  character.districtId = districtId
  return state
}

const initiateDistrict = function (characterCount, vehicleCount) {
  const {state} = this
  const {districtKit} = state
  const district = districtKit.create(state)
  const {id: districtId} = district
  populate.call(this, 'character', characterCount, districtId)
  populate.call(this, 'vehicle', vehicleCount, districtId)
  return state
}

const populate = function (entityType, count, districtId) {
  const {state} = this
  const {_districts, _entities, entityKit, districtKit} = state
  while (count) {
    const entity = entityKit.create(entityType, _entities, districtId)
    districtKit.addToDistrict(entity, _districts)
    --count
  }
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
  const {_districts, _players, _entities, playerKit, entityKit, districtKit} = state
  const activeKit = {walkerIds: [], driverIds: [], passengerIds: []}
  const tick = ++state.tick
  state.refreshStartTime = now()
  runQueues.call({state})
  updateIsActive.call({state}, _players)
  const playerCharacterIds = playerKit.getPlayerCharacterIds(_players)
  const playerCharacters = playerCharacterIds.map(id => _entities[id])
  const {walkerIds, driverIds, passengerIds} = playerCharacters.reduce(pushIfActive, activeKit)
  const walkers = walkerIds.map(id => _entities[id])
  const {characterIds, vehicleIds} = districtKit.checkVehicleKeylessMatches(walkers, _districts)
  const vehicleEntryKit = entityKit.checkForVehicleEntries(characterIds, vehicleIds, _entities)
  const {characterIdsToEnter, vehicleIdsToBeEntered, nonEntereringWalkerIdss} = vehicleEntryKit
  const puttedKit = entityKit.putCharactersInVehicles(characterIdsToEnter, vehicleIdsToBeEntered, _entities)
  const {strandedWalkerIdss} = puttedKit
  passengerIds.forEach(entityKit.exitVehicle, {_entities})
  driverIds.forEach(entityKit.exitVehicle, {_entities})
  const characterIds_ = [driverIds, nonEntereringWalkerIdss, strandedWalkerIdss].flat()
  const characterIds__ = characterIds_.reduce(pushIfUnique.bind({}), [])
  districtKit.addToGrid(characterIds__, _districts)
  const {collisions, interactions} = districtKit.detectCollisions(characterIds__, _districts)
  if (collisions.length) collideVehicles(collisions)
  if (interactions.length) makeCharactersInteract(interactions)
  walkOrDrive.call({state}, playerCharacters, _players)
  _entities.forEach(entityKit.updateLocation, {state})
  if (tick % 3) return callRefreshAfterDelay(state)
  const latencyKits = playerKit.getLatencyKits(_players)
  latencyKits.forEach(entityKit.updateLatencies, {_entities})
  entityKit.emit(io, _entities)
  callRefreshAfterDelay(state)
  return state
}

const pushIfActive = (activeKit, character) => {
  const {walkerIds, driverIds, passengerIds} = activeKit
  const {isActive, drivingId, passengingId, id: characterId} = character
  if (isActive && drivingId) (character.isActive = false) || driverIds.push(characterId)
  else if (isActive && passengingId) (character.isActive = false) || passengerIds.push(characterId)
  else if (isActive) (character.isActive = false) || walkerIds.push(characterId)
  return activeKit
}

const pushIfUnique = function (uniques, entity) {
  const entityById = this
  const {id} = entity
  const entity_ = entityById[id]
  if (entity_) return uniques
  entityById[id] = entity
  return uniques
}

function collideVehicles({vehicleIdsA, vehicleIdsB}) { // eslint-disable-line no-unused-vars
}

function makeCharactersInteract({characterIdsA, characterIdsB}) { // eslint-disable-line no-unused-vars
}

const updateIsActive = function (allPlayers) {
  const {state} = this
  const {_players, _entities, playerKit} = state
  allPlayers.forEach(player => {
    const {id: playerId, input, characterId, previousAction} = player
    const character = _entities[characterId]
    const {action} = input
    if (action && !previousAction) character.isActive = true
    else character.isActive = false
    playerKit.setPreviousAction(action, playerId, _players)
  })
  return state
}

const walkOrDrive = function (playerCharacters, allPlayers) {
  const {state} = this
  const {entityKit, _entities} = state
  playerCharacters.forEach(playerCharacter => {
    const {playerId, drivingId, passengingId, id} = playerCharacter
    const player = allPlayers[playerId]
    const {input} = player
    if (drivingId) entityKit.drive(id, input, _entities)
    else if (!passengingId) entityKit.walk(id, input, _entities)
  })
  return state
}

const callRefreshAfterDelay = state => {
  const {delayKit, fps, now, refreshStartTime} = state
  const millisecondsPerFrame = 1000 / fps
  const refreshWithState = refresh.bind(null, state)
  delayKit.loopStartTime || (delayKit.loopStartTime = now() - millisecondsPerFrame)
  delayKit.millisecondsAhead || (delayKit.millisecondsAhead = 0)
  const refreshDuration = now() - refreshStartTime
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
  const {_districts, _entities, _players, playerKit, districtKit, entityKit} = state
  const {id: socketId} = socket
  const player = wrappedPlayer.player = playerKit.create(_players, socketId)
  const {id: playerId} = player
  const districtId = districtKit.choose(_districts) || initiateDistrict.call({state})
  const districtIdString = districtId.toString()
  const character = entityKit.create('character', _entities, districtId)
  const {id: characterId} = character
  player.characterId = characterId
  character.playerId = playerId
  socket.join(districtIdString)
  const {x: characterX} = character
  const vehicleX = getVehicleX(characterX)
  const configuration = {x: vehicleX, y: 7843, speed: 0}
  const vehicle = entityKit.create('vehicle', _entities, districtId, configuration)
  entityKit.giveKey(character, vehicle, true)
  districtKit.addToDistrict(character, _districts)
  districtKit.addToDistrict(vehicle, _districts)
  socket.emit('player', player)
  districtKit.emit(districtId, socket, _districts)
  io.to(districtIdString).emit('entity', character)
  io.to(districtIdString).emit('entity', vehicle)
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
initiateDistrict.call({state}, 20, 40)
io.on('connection', handleConnection.bind({state}))
app.use(static_(join(__dirname, 'public')))
server.listen(port, () => console.log('Listening on port ' + port))
refresh(state)
