import express, {static as static_} from 'express'
import {Server} from 'http'
import socketIo from 'socket.io'
import {join} from 'path'
import now from 'performance-now'

const app = express()
const server = Server(app)
const io = socketIo(server)
const port = process.env.PORT || 3000

const state = {
  tick: 0,
  elementCount: 0,
  layerY: 0,
  fps: 30,
  characterCount: 50,
  vehicleCount: 51,
  connectionQueue: [],
  latencyQueue: [],
  inputQueue: [],
  delayKit: {},
  _players: [],
  _characters: [],
  _vehicles: [],
  now
}

const makePlayer = (_players, socketId) => {
  const player = createPlayer()
  player.socketId = socketId
  player.id = _players.length
  _players.push(player)
  return player
}

const updateInput = function ({input, wrappedPlayer}) {
  const {state} = this
  const {_characters} = state
  const {player} = wrappedPlayer
  const {characterId} = player
  const {tick} = input
  handleTick(tick, characterId, _characters)
  player && (player.input = input)
}

const updateLatencyBuffer = ({latency, wrappedPlayer}) => {
  const {player} = wrappedPlayer
  const {latencyBuffer} = player
  latencyBuffer.push(latency)
  latencyBuffer.length > 20 && latencyBuffer.shift()
}

const getLatencyKits = function (player) {
  const {_players} = this
  const {status, characterId, id} = player
  const latency = getLatency(id, _players)
  return status === 'online' && {characterId, latency}
}

const getLatency = (id, _players) => {
  const player = _players[id]
  const {latencyBuffer} = player
  const {length} = latencyBuffer
  const total = latencyBuffer.reduce((total, latency) => total + latency, 0)
  return total / length
}

const createPlayer = () => {
  const input = {
    up: false,
    down: false,
    left: false,
    right: false,
    action: false
  }
  const prototype = {
    id: null,
    status: 'online',
    socketId: null,
    characterId: null,
    previousAction: false,
    latencyBuffer: [],
    input
  }
  return Object
    .entries(prototype)
    .reduce(appendAttribute, {})
}

const appendAttribute = (item, [key, value]) => {
  item[key] =
      Array.isArray(value) ? [...value]
    : value && value === 'object' ? {...value}
    : value
  return item
}

const initiate = state => {
  let {characterCount, vehicleCount} = state
  state.city = makeCity(state)
  createMayor(state)
  while (characterCount) makeCharacter(state) && --characterCount
  while (vehicleCount) makeVehicle(state) && --vehicleCount
  return state
}

const makeCity = state => {
  const city = createCity()
  const {backgroundLayers, foregroundLayers} = city
  backgroundLayers.forEach(assignElementIds, {state})
  foregroundLayers.forEach(assignElementIds, {state})
  backgroundLayers.forEach(handleLayer, {state})
  foregroundLayers.forEach(handleLayer, {state, isForeground: true})
  return city
}

const createMayor = state => {
  const {_players} = state
  const player = makePlayer(_players)
  const character = makeCharacter(state)
  const vehicle = makeVehicle(state)
  const {id: playerId} = player
  const {id: characterId} = character
  player.characterId = characterId
  character.playerId = playerId
  character.elementId = null
  vehicle.elementId = null
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
  const {_players, _characters, _vehicles} = state
  const tick = ++state.tick
  state.refreshingStartTime = now()
  runQueues.call({state})
  const playerCharacters = _players.map(({characterId}) => _characters[characterId])
  const {actives} = playerCharacters.reduce(pushIfActive, {_players, actives: []})
  const activesByCategory = {walkers: [], drivers: [], passengers: []}
  const {walkers, drivers, passengers} = actives.reduce(categorize, activesByCategory)
  walkers.reduce(enterIfCan, _vehicles)
  passengers.reduce(exitVehicle, state)
  drivers.reduce(exitVehicle, state)
  const charactersByCategory = {walkers: [], drivers: [], passengers: []}
  const args = [categorize, charactersByCategory]
  const {walkers: walkers_, drivers: drivers_} = playerCharacters.reduce(...args)
  walkers_.forEach(walk, {_players})
  drivers_.forEach(drive, {state})
  _characters.forEach(updateCharacterLocation, {state})
  _vehicles.forEach(updateVehicleLocation, {state})
  if (tick % 3) return deferRefresh(state)
  const latencyKits = _players.map(getLatencyKits, {_players})
  latencyKits.reduce(updateLatencies, _characters)
  emitEntities(io, _characters, _vehicles)
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

const enterIfCan = (_vehicles, walker) => {
  const vehicle = _vehicles.find(canVehicleBeEntered, {walker})
  if (!vehicle) return _vehicles
  enter(vehicle, walker)
  return _vehicles
}

const canVehicleBeEntered = function (vehicle) {
  const {walker} = this
  const {id: vehicleId, driverId, passengerIds, seatCount} = vehicle
  const {length: passengerCount} = passengerIds
  const driverCount = driverId ? 1 : 0
  if (!vehicleId || driverCount + passengerCount >= seatCount) return false
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
  const {_players, _vehicles} = state
  const {playerId, drivingId: vehicleId} = character
  const player = _players[playerId]
  const {input} = player
  const vehicle = _vehicles[vehicleId]
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
  const {connectionQueue, latencyQueue, inputQueue} = state
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
  const {_players, city} = state
  const {id: socketId} = socket
  const player = wrappedPlayer.player = makePlayer(_players, socketId)
  const {id: playerId} = player
  const character = makeCharacter(state)
  const {id: characterId} = character
  player.characterId = characterId
  character.playerId = playerId
  const {x: characterX} = character
  const vehicleX = getVehicleX(characterX)
  const vehicle = makeVehicle(state, vehicleX, 7843, 0)
  socket.emit('player', player)
  socket.emit('city', city)
  io.emit('entity', character)
  io.emit('entity', vehicle)
  return state
}

const getVehicleX = characterX => {
  const distance = Math.random() * (1000 - 200) + 200
  const sides = ['left', 'right']
  const random = Math.random()
  const index = Math.floor(random * sides.length)
  const side = sides[index]
  return side === 'left' ? characterX - distance : characterX + distance
}

const createCity = () => {
  const backgroundLayers = [
    {
      id: 1,
      blueprints: [],
      tag: 'canvas',
      width: 16000,
      height: 8000,
      depth: 4,
      sections: [
        {
          id: 1,
          rowCount: 1,
          variations: [
            {
              id: 1,
              prevalence: 1,
              tag: 'img',
              src: 'images/background/far/above-top.png',
              width: 1024,
              height: 367
            }
          ]
        },
        {
          id: 2,
          rowCount: 1,
          variations: [
            {
              id: 1,
              prevalence: 4,
              tag: 'img',
              src: 'images/background/far/top/top.png',
              width: 1024,
              height: 260
            },
            {
              id: 2,
              prevalence: 1,
              tag: 'img',
              src: 'images/background/far/top/top-pink-jumbotron-left.png',
              width: 1024,
              height: 260
            },
            {
              id: 3,
              prevalence: 2,
              tag: 'img',
              src: 'images/background/far/top/top-pink-jumbotron-right.png',
              width: 1024,
              height: 260
            }
          ]
        },
        {
          id: 3,
          rowCount: 48,
          variations: [
            {
              id: 1,
              prevalence: 3,
              tag: 'img',
              src: 'images/background/far/middle/middle.png',
              width: 1024,
              height: 134
            },
            {
              id: 2,
              prevalence: 2,
              tag: 'img',
              src: 'images/background/far/middle/middle-pink-jumbotron-far-left.png',
              width: 1024,
              height: 134
            },
            {
              id: 3,
              prevalence: 1,
              tag: 'img',
              src: 'images/background/far/middle/middle-pink-jumbotron-left.png',
              width: 1024,
              height: 134
            },
            {
              id: 4,
              prevalence: 1,
              tag: 'img',
              src: 'images/background/far/middle/middle-pink-jumbotron-mid-left.png',
              width: 1024,
              height: 134
            },
            {
              id: 5,
              prevalence: 2,
              tag: 'img',
              src: 'images/background/far/middle/middle-pink-jumbotron-middle.png',
              width: 1024,
              height: 134
            },
            {
              id: 6,
              prevalence: 2,
              tag: 'img',
              src: 'images/background/far/middle/middle-pink-jumbotron-right.png',
              width: 1024,
              height: 134
            },
            {
              id: 7,
              prevalence: 3,
              tag: 'img',
              src: 'images/background/far/middle/middle-blue-jumbotron-left.png',
              width: 1024,
              height: 134
            },
            {
              id: 8,
              prevalence: 2,
              tag: 'img',
              src: 'images/background/far/middle/middle-blue-jumbotron-middle.png',
              width: 1024,
              height: 134
            },
            {
              id: 9,
              prevalence: 3,
              tag: 'img',
              src: 'images/background/far/middle/middle-blue-jumbotron-right.png',
              width: 1024,
              height: 134
            }
          ]
        },
        {
          id: 4,
          rowCount: 1,
          variations: [
            {
              id: 1,
              prevalence: 1,
              tag: 'img',
              src: 'images/background/far/bottom.png',
              width: 1024,
              height: 673
            }
          ]
        }
      ]
    },
    {
      id: 2,
      blueprints: [],
      y: 7050,
      tag: 'canvas',
      width: 24000,
      height: 8000,
      depth: 2,
      sections: [
        {
          id: 1,
          rowCount: 1,
          variations: [
            {
              id: 1,
              width: 1024,
              height: 768,
              prevalence: 1,
              tag: 'img',
              src: 'images/background/middle.png'
            }
          ]
        }
      ]
    },
    {
      id: 3,
      blueprints: [],
      y: 7232,
      tag: 'canvas',
      width: 32000,
      height: 8000,
      depth: 1,
      sections: [
        {
          id: 1,
          rowCount: 1,
          variations: [
            {
              id: 1,
              width: 1408,
              height: 768,
              prevalence: 1,
              tag: 'img',
              src: 'images/background/near.png'
            }
          ]
        }
      ]
    }
  ]
  const foregroundLayers = [
    {
      id: 1,
      blueprints: [],
      x: 0,
      y: 7456,
      width: 32000,
      height: 8000,
      depth: 0.5,
      tag: 'canvas',
      scale: 16,
      sections: [
        {
          id: 1,
          rowCount: 1,
          variations: [
            {
              id: 1,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/lamp/left.png',
              width: 144,
              height: 544
            },
            {
              id: 2,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/lamp/right.png',
              width: 144,
              height: 544
            }
          ]
        }
      ]
    },
    {
      id: 2,
      blueprints: [],
      x: 32000,
      y: 7456,
      width: 32000,
      height: 8000,
      depth: 0.5,
      tag: 'canvas',
      scale: 16,
      sections: [
        {
          id: 1,
          rowCount: 1,
          variations: [
            {
              id: 1,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/lamp/left.png',
              width: 144,
              height: 544
            },
            {
              id: 2,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/lamp/right.png',
              width: 144,
              height: 544
            }
          ]
        }
      ]
    },
    {
      id: 3,
      blueprints: [],
      x: 0,
      y: 6800,
      width: 32000,
      height: 8000,
      depth: 0.25,
      tag: 'canvas',
      scale: 64,
      sections: [
        {
          id: 1,
          rowCount: 1,
          variations: [
            {
              id: 1,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/up-left.png',
              width: 448,
              height: 1248
            },
            {
              id: 2,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/up-right.png',
              width: 448,
              height: 1248
            },
            {
              id: 3,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/down-left.png',
              width: 448,
              height: 1248
            },
            {
              id: 4,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/down-right.png',
              width: 448,
              height: 1248
            },
            {
              id: 5,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/left-up.png',
              width: 1248,
              height: 448
            },
            {
              id: 6,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/left-down.png',
              width: 1248,
              height: 448
            },
            {
              id: 7,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/right-up.png',
              width: 1248,
              height: 448
            },
            {
              id: 8,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/right-down.png',
              width: 1248,
              height: 448
            }
          ]
        }
      ]
    },
    {
      id: 4,
      blueprints: [],
      x: 32000,
      y: 6800,
      width: 32000,
      height: 8000,
      depth: 0.25,
      tag: 'canvas',
      scale: 64,
      sections: [
        {
          id: 1,
          rowCount: 1,
          variations: [
            {
              id: 1,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/up-left.png',
              width: 448,
              height: 1248
            },
            {
              id: 2,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/up-right.png',
              width: 448,
              height: 1248
            },
            {
              id: 3,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/down-left.png',
              width: 448,
              height: 1248
            },
            {
              id: 4,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/down-right.png',
              width: 448,
              height: 1248
            },
            {
              id: 5,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/left-up.png',
              width: 1248,
              height: 448
            },
            {
              id: 6,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/left-down.png',
              width: 1248,
              height: 448
            },
            {
              id: 7,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/right-up.png',
              width: 1248,
              height: 448
            },
            {
              id: 8,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/right-down.png',
              width: 1248,
              height: 448
            }
          ]
        }
      ]
    },
    {
      id: 5,
      blueprints: [],
      x: 64000,
      y: 6800,
      width: 32000,
      height: 8000,
      depth: 0.25,
      tag: 'canvas',
      scale: 64,
      sections: [
        {
          id: 1,
          rowCount: 1,
          variations: [
            {
              id: 1,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/up-left.png',
              width: 448,
              height: 1248
            },
            {
              id: 2,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/up-right.png',
              width: 448,
              height: 1248
            },
            {
              id: 3,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/down-left.png',
              width: 448,
              height: 1248
            },
            {
              id: 4,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/down-right.png',
              width: 448,
              height: 1248
            },
            {
              id: 5,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/left-up.png',
              width: 1248,
              height: 448
            },
            {
              id: 6,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/left-down.png',
              width: 1248,
              height: 448
            },
            {
              id: 7,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/right-up.png',
              width: 1248,
              height: 448
            },
            {
              id: 8,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/right-down.png',
              width: 1248,
              height: 448
            }
          ]
        }
      ]
    },
    {
      id: 6,
      blueprints: [],
      x: 96000,
      y: 6800,
      width: 32000,
      height: 8000,
      depth: 0.25,
      tag: 'canvas',
      scale: 64,
      sections: [
        {
          id: 1,
          rowCount: 1,
          variations: [
            {
              id: 1,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/up-left.png',
              width: 448,
              height: 1248
            },
            {
              id: 2,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/up-right.png',
              width: 448,
              height: 1248
            },
            {
              id: 3,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/down-left.png',
              width: 448,
              height: 1248
            },
            {
              id: 4,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/down-right.png',
              width: 448,
              height: 1248
            },
            {
              id: 5,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/left-up.png',
              width: 1248,
              height: 448
            },
            {
              id: 6,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/left-down.png',
              width: 1248,
              height: 448
            },
            {
              id: 7,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/right-up.png',
              width: 1248,
              height: 448
            },
            {
              id: 8,
              prevalence: 1,
              tag: 'img',
              src: 'images/foreground/arrow/right-down.png',
              width: 1248,
              height: 448
            }
          ]
        }
      ]
    }
  ]
  const prototype = {
    width: 32000,
    height: 8000,
    backgroundLayers,
    foregroundLayers
  }
  return Object
    .entries(prototype)
    .reduce(appendAttribute, {})
}

const assignElementIds = function (layer) {
  Object.entries(layer).forEach(assignElementId, {...this, layer})
}

const assignElementId = function ([key, value]) {
  const {state, layer} = this
  if (key === 'tag') layer.elementId = 'scenery-' + ++state.elementCount
  else if (Array.isArray(value)) value.forEach(assignElementIds, this)
  return state
}

const handleLayer = function (layer) {
  const {sections} = layer
  sections.forEach(handleSection, {...this, layer})
}

const handleSection = function (section, sectionIndex) {
  const {variations} = section
  const variationOptions = []
  variations.forEach(pushVariation, {variationOptions})
  pushBlueprints({...this, section, sectionIndex, variationOptions})
}

const pushVariation = function (variation, index) {
  const {variationOptions} = this
  let {prevalence} = variation
  while (prevalence) variationOptions.push({variation, index}) && --prevalence
}

const pushBlueprints = argumentation => {
  argumentation.rowsDrawn = 0
  startRow(argumentation)
}

const startRow = argumentation => {
  const {rowsDrawn, section} = argumentation
  const {rowCount} = section
  argumentation.x = 0
  argumentation.rowY = 0
  if (rowsDrawn < rowCount) pushBlueprint(argumentation)
}

const pushBlueprint = argumentation => {
  const {state, x, layer, variationOptions, sectionIndex, isForeground} = argumentation
  if (x >= layer.width) return callStartRow(argumentation)
  const float = Math.random() * variationOptions.length
  const index = Math.floor(float)
  const variationChoice = argumentation.variationChoice = variationOptions[index]
  const {variation, index: variationIndex} = variationChoice
  layer.y && (state.layerY = layer.y)
  const blueprint = {sectionIndex, variationIndex, x, y: state.layerY}
  layer.blueprints.push(blueprint)
  isForeground && handleIsForeground(argumentation)
  argumentation.x += variation.width
  argumentation.rowY = variation.height
  pushBlueprint(argumentation)
}

const callStartRow = argumentation => {
  const {state, rowY} = argumentation
  ++argumentation.rowsDrawn
  state.layerY += rowY
  startRow(argumentation)
}

const handleIsForeground = argumentation => {
  const {layer, variationChoice} = argumentation
  const {variation} = variationChoice
  if (layer.id < 3) return argumentation.x += 2000
  const float = Math.random() * (3000 - 1000) + 1000
  const gap = Math.floor(float)
  argumentation.x += gap + variation.width
}

const makeCharacter = (state, configuration) => {
  const {_characters, city} = state
  const {x, speed} = configuration || {}
  const directions = ['left', 'right']
  const character = createCharacter()
  const id = character.id = _characters.length
  character.elementId = 'character-' + id
  _characters.push(character)
  const float = Math.random() * directions.length
  const index = Math.floor(float)
  character.direction = directions[index]
  character.x = x || x === 0 ? x : Math.random() * (city.width - character.width)
  character.y = city.height - 168
  character.speed = speed || speed === 0 ? speed : Math.random() * character.maxSpeed
  return character
}

const createCharacter = () => {
  const prototype = {
    id: null,
    type: 'character',
    name: 'Fred',
    status: 'alive',
    playerId: null,
    latency: null,
    drivingId: null,
    passengingId: null,
    occupyingId: null,
    vehicleMasterKeys: [],
    vehicleKeys: [],
    vehicleWelcomeIds: [],
    roomMasterKeys: [],
    roomKeys: [],
    x: null,
    y: null,
    width: 70,
    height: 103,
    depth: 1,
    direction: 'right',
    speed: null,
    maxSpeed: 10,
    isActive: false,
    tag: 'img',
    elementId: null,
    src: 'images/characters/man.png'
  }
  return Object
    .entries(prototype)
    .reduce(appendAttribute, {})
}

const makeVehicle = (state, x, y, speed) => {
  const {_vehicles, city} = state
  const directions = [
    'left', 'right', 'up', 'down', 'up-left', 'up-right', 'down-left', 'down-right'
  ]
  const percentages = [
    0.1,
    0.2,
    0.3,
    0.4,
    0.5,
    0.6,
    0.7,
    0.8,
    0.9,
    1,
    0.1,
    0.2,
    0.3,
    0.4,
    0.5,
    0.6,
    0.1,
    0.2,
    0.3,
    0.4,
    0.1,
    0.2,
    0.3,
    0.3,
    0.4
  ]
  const vehicle = createVehicle()
  const id = vehicle.id = _vehicles.length
  vehicle.elementId = 'vehicle-' + id
  _vehicles.push(vehicle)
  const float = Math.random() * directions.length
  const index = Math.floor(float)
  vehicle.direction = directions[index]
  vehicle.x = x || x === 0 ? x : Math.random() * (city.width - vehicle.width)
  const float_ = Math.random() * percentages.length
  const index_ = Math.floor(float_)
  const percentage = percentages[index_]
  vehicle.speed = speed || speed === 0 ? speed : Math.random() * vehicle.maxSpeed * percentage
  vehicle.y = y || y === 0 ? y : Math.random() * (city.height - vehicle.height - 77)
  return vehicle
}

const createVehicle = () => {
  const prototype = {
    id: null,
    type: 'vehicle',
    model: 'delorean',
    status: 'operational',
    seatCount: 2,
    driverId: null,
    masterKeyHolderIds: [],
    keyHolderIds: [],
    welcomIds: [],
    passengerIds: [],
    x: null,
    y: null,
    width: 268,
    height: 80,
    direction: 'right',
    previousDirection: null,
    speed: null,
    maxSpeed: 75,
    isSlowing: false,
    isDescending: false,
    acceleration: 0.6,
    deceleration: 1.2,
    armorLevel: 0,
    weight: 2712,
    tag: 'img',
    elementId: null,
    src: 'images/vehicles/delorean.png'
  }
  return Object
    .entries(prototype)
    .reduce(appendAttribute, {})
}

const exitVehicleAsPassenger = (characterId, vehicle) => {
  const {passengerIds} = vehicle
  const index = passengerIds.indexOf(characterId)
  index + 1 && passengerIds.splice(index, 1)
  return vehicle
}

const exitVehicle = (state, character) => {
  const {_vehicles} = state
  const {id: characterId, drivingId, passengingId} = character
  const vehicleId = drivingId || passengingId
  const vehicle = _vehicles[vehicleId]
  character.drivingId = null
  character.passengingId = null
  if (passengingId) return exitVehicleAsPassenger(characterId, vehicle) && state
  vehicle.driverId = null
  vehicle.isSlowing = true
  vehicle.isDescending = true
  return state
}

const slowDownVehicle = vehicle => {
  const {speed, maxSpeed} = vehicle
  const percentage = speed / maxSpeed
  const multiplier =
      percentage > 0.5 ? percentage * 2
    : percentage > 0.25 ? 1
    : 0.5
  vehicle.speed -= vehicle.deceleration * multiplier
  if (vehicle.speed > 0) return
  vehicle.speed = 0
  vehicle.isSlowing = false
}

const descendVehicle = vehicle => {
  vehicle.y += 5
  if (vehicle.y < 7843) return
  vehicle.isDescending = false
  vehicle.y = 7843
}

const updateCharacterLocation = function (character) {
  const {state} = this
  const {drivingId, passengingId} = character
  if (drivingId || passengingId) updateTravelingCharacterLocation(character, state)
  else updateWalkingCharacterLocation(character, state)
  return character
}

const updateTravelingCharacterLocation = (character, state) => {
  const {_vehicles} = state
  const {drivingId, passengingId} = character
  const vehicle = drivingId ? _vehicles[drivingId] : _vehicles[passengingId]
  const {x, y, width, height, direction} = vehicle
  const leftDirections = ['left', 'up-left', 'down-left']
  const rightDirections = ['right', 'up-right', 'down-right']
  character.x = x + width / 2 - character.width / 2
  character.y = y + height / 2 - character.height / 2 - 5
  leftDirections.includes(direction) && (character.direction = 'left')
  rightDirections.includes(direction) && (character.direction = 'right')
  return character
}

const updateWalkingCharacterLocation = (character, state) => {
  const {city} = state
  const {speed, direction, width, playerId, x} = character
  const maxX = city.width - width
  character.y < 0 && (character.y = 0)
  character.y < 7832 && (character.y += 20)
  character.y > 7832 && (character.y = 7832)
  if (speed <= 0) return state
  character.x = direction === 'left' ? x - speed : x + speed
  if (playerId) {
    character.x < 0 && (character.x = 0)
    character.x > maxX && (character.x = maxX)
    return state
  }
  character.x < 0 && (character.direction = 'right')
  character.x > maxX && (character.direction = 'left')
  return character
}

const updateVehicleLocation = function (vehicle) {
  const {state} = this
  const {isSlowing, isDescending} = vehicle
  if (isDescending) descendVehicle(vehicle)
  if (isSlowing) slowDownVehicle(vehicle)
  updateVehicleLocation_(vehicle, state)
  return vehicle
}

const updateVehicleLocation_ = (vehicle, state) => {
  const {city, _characters} = state
  const {speed, direction, width, height, driverId, x, y} = vehicle
  const character = driverId && _characters[driverId]
  const {playerId} = character || {}
  const distance = Math.sqrt(speed ** 2 * 2)
  const maxX = city.width - width
  const maxY = city.height - height - 77
  const x_ = vehicle.x =
      direction === 'left' ? x - speed
    : direction === 'right' ? x + speed
    : direction === 'up-right' ? x + distance
    : direction === 'down-right' ? x + distance
    : direction === 'up-left' ? x - distance
    : direction === 'down-left' ? x - distance
    : x
  const y_ = vehicle.y =
      y > maxY ? maxY
    : direction === 'up' ? y - speed
    : direction === 'down' ? y + speed
    : direction === 'up-right' ? y - distance
    : direction === 'down-right' ? y + distance
    : direction === 'up-left' ? y - distance
    : direction === 'down-left' ? y + distance
    : y
  const directions =
      direction === 'up' ? ['left', 'right', 'down', 'down-left', 'down-right', 'down-left', 'down-right']
    : direction === 'down' ? ['left', 'right', 'up', 'up-left', 'up-right', 'up-left', 'up-right']
    : direction === 'left' ? ['up', 'down', 'right', 'up-right', 'down-right', 'right', 'up-right', 'down-right']
    : direction === 'right' ? ['up', 'down', 'up-left', 'down-left', 'left', 'up-left', 'down-left', 'left']
    : direction === 'up-right' ? ['left', 'up-left', 'down-left', 'down-right']
    : direction === 'down-right' ? ['left', 'up-left', 'up-right', 'down-left']
    : direction === 'up-left' ? ['right', 'up-right', 'down-left', 'down-right']
    : direction === 'down-left' ? ['right', 'up-left', 'up-right', 'down-right']
    : direction
  if (playerId) {
    x_ <= 0 && stopVehicle(vehicle) && (vehicle.x = 0)
    x_ >= maxX && stopVehicle(vehicle) && (vehicle.x = maxX)
    y_ < 0 && (vehicle.y = 0)
    y_ > maxY && (vehicle.y = maxY)
    return vehicle
  }
  x_ < 0 && (vehicle.x = 0)
  x_ > maxX && (vehicle.x = maxX)
  y_ < 0 && (vehicle.y = 0)
  y_ > maxY && (vehicle.y = maxY)
  if (x_ >= 0 && x_ <= maxX && y_ >= 0 && y_ <= maxY) return vehicle
  const {length: directionCount} = directions
  const float = Math.random() * directionCount
  const index = Math.floor(float)
  vehicle.direction = directions[index]
  return vehicle
}

const stopVehicle = vehicle => (vehicle.speed = 0) || vehicle

const updateLatencies = (_characters, latencyKit) => {
  if (!latencyKit) return
  const {characterId, latency} = latencyKit
  const character = _characters[characterId]
  character.latency = latency
  return _characters
}

const handleTick = (tick, characterId, _characters) => {
  const character = _characters[characterId]
  character.tick = tick
}

const emitEntities = (io, _characters, _vehicles) => {
  const entitiesByType = {characters: _characters, vehicles: _vehicles}
  const [mayor] = _characters
  mayor.timestamp = now()
  io.emit('entities', entitiesByType)
}

initiate(state)
io.on('connection', handleConnection.bind({state}))
app.use(static_(join(__dirname, 'public')))
server.listen(port, () => console.log('Listening on port ' + port))
refresh(state)
