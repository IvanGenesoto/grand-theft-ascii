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
  fps: 30,
  connectionQueue: [],
  latencyQueue: [],
  inputQueue: [],
  delayKit: {},
  districtKit: getDistrictKit(),
  entityKit: getEntityKit(),
  playerKit: getPlayerKit(),
  now
}

const createMayor = function () {
  const {state} = this
  const {playerKit, entityKit, districtKit} = state
  const playerId = playerKit.create()
  const characterId = entityKit.create('character')
  const districtId = districtKit.create(true)
  playerKit.assignCharacter(playerId, characterId)
  entityKit.assignPlayer(characterId, playerId)
  entityKit.assignDistrict(characterId, districtId)
  return state
}

const initiateDistrict = function (characterCount, vehicleCount) {
  const {state} = this
  const {districtKit} = state
  const districtId = districtKit.create()
  populate.call(this, 'character', characterCount, districtId)
  populate.call(this, 'vehicle', vehicleCount, districtId)
  return state
}

const populate = function (entityType, count, districtId) {
  const {state} = this
  const {entityKit, districtKit} = state
  while (count) {
    const entityId = entityKit.create(entityType, districtId)
    const entity = entityKit.clone(entityId)
    districtKit.addToDistrict(entity)
    --count
  }
  return state
}

const handleConnection = function (socket) {
  const {state} = this
  const {connectionQueue} = state
  const wrappedPlayerId = {}
  connectionQueue.push({socket, wrappedPlayerId})
  socket.on('timestamp', handleTimestamp.bind({state, wrappedPlayerId}))
  socket.on('input', handleInput.bind({state, wrappedPlayerId}))
  return state
}

const handleTimestamp = function (timestamp) {
  const {state, wrappedPlayerId} = this
  const {latencyQueue} = state
  const newTimestamp = now()
  const latency = newTimestamp - timestamp
  latencyQueue.push({latency, wrappedPlayerId})
  return state
}

const handleInput = function (input) {
  const {state, wrappedPlayerId} = this
  const {inputQueue} = state
  inputQueue.push({input, wrappedPlayerId})
  return state
}

const refresh = state => {
  const {playerKit, entityKit, districtKit} = state
  const activeKit = {walkerIds: [], driverIds: [], passengerIds: []}
  const tick = ++state.tick
  state.refreshStartTime = now()
  runQueues.call({state})
  const allPlayers = playerKit.cloneAll()
  updateIsActive.call({state}, allPlayers)
  const playerCharacterIds = playerKit.getPlayerCharacterIds()
  const playerCharacters = entityKit.cloneMultiple(playerCharacterIds)
  const {walkerIds, driverIds, passengerIds} = playerCharacters.reduce(pushIfActive, activeKit)
  const walkerClones = entityKit.cloneMultiple(walkerIds)
  const {characterIds, vehicleIds} = districtKit.checkVehicleKeylessMatches(walkerClones)
  const vehicleEntryKit = entityKit.checkForVehicleEntries(characterIds, vehicleIds)
  const {characterIdsToEnter, vehicleIdsToBeEntered, nonEntereringWalkerIdss} = vehicleEntryKit
  const puttedKit = entityKit.putCharactersInVehicles(characterIdsToEnter, vehicleIdsToBeEntered)
  const {characterIdsPutInVehicles, vehicleIdsCharactersWerePutIn, strandedWalkerIdss} = puttedKit
  entityKit.exitVehicles(passengerIds)
  entityKit.exitVehicles(driverIds)
  const characterIds_ = entityKit.cloneMultiple(driverIds, nonEntereringWalkerIdss, strandedWalkerIdss)
  const characterIds__ = characterIds_.reduce(pushIfUnique.bind({}), [])
  districtKit.addToGrid(characterIds__)
  const {collisions, interactions} = districtKit.detectCollisions(characterIds__)
  if (collisions && collisions.length) var collidedVehicles = collideVehicles(collisions)
  if (interactions && interactions.length) var interacted = makeCharactersInteract(interactions)
  entityKit.cloneMultiple(
    characterIdsPutInVehicles, vehicleIdsCharactersWerePutIn, collidedVehicles, interacted
  )
  const playerCharacterIds_ = playerKit.getPlayerCharacterIds()
  const playerCharacters_ = entityKit.cloneMultiple(playerCharacterIds_)
  entityKit.cloneAll()
  walkOrDrive.call({state}, playerCharacters_, allPlayers)
  const allDistricts = districtKit.cloneAll()
  entityKit.updateLocations(allDistricts)
  if (tick % 3) return callRefreshAfterDelay(state)
  const latencyKits = playerKit.getLatencyKits()
  entityKit.updateLatencies(latencyKits)
  entityKit.emit(io)
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
  const {entityKit, playerKit} = state
  allPlayers.forEach(player => {
    const {id: playerId, input, characterId, previousAction} = player
    const {action} = input
    if (action && !previousAction) entityKit.activate(characterId)
    else entityKit.inactivate(characterId)
    playerKit.setPreviousAction(action, playerId)
    entityKit.clone(characterId)
  })
  return state
}

const walkOrDrive = function (playerCharacters, allPlayers) {
  const {state} = this
  const {entityKit} = state
  playerCharacters.forEach(playerCharacter => {
    const {playerId, drivingId, passengingId, id} = playerCharacter
    const player = allPlayers[playerId]
    const {input} = player
    if (drivingId) entityKit.drive(id, input)
    else if (!passengingId) entityKit.walk(id, input)
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

const initiatePlayer = function ({socket, wrappedPlayerId}) {
  const {state} = this
  const {playerKit, districtKit, entityKit} = state
  const {id: socketId} = socket
  const playerId = wrappedPlayerId.playerId = playerKit.create(socketId)
  const districtId = districtKit.choose() || initiateDistrict.call({state})
  const districtIdString = districtId.toString()
  const characterId = entityKit.create('character', districtId)
  playerKit.assignCharacter(playerId, characterId)
  socket.join(districtIdString)
  entityKit.assignPlayer(characterId, playerId)
  const character = entityKit.clone(characterId)
  const {x: characterX} = character
  const vehicleX = getVehicleX(characterX)
  const configuration = {x: vehicleX, y: 7843, speed: 0}
  const vehicleId = entityKit.create('vehicle', districtId, configuration)
  entityKit.giveKey(characterId, vehicleId, true)
  const vehicle = entityKit.clone(vehicleId)
  districtKit.addToDistrict(character)
  districtKit.addToDistrict(vehicle)
  playerKit.emit(playerId, socket)
  districtKit.emit(districtId, socket)
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

createMayor.call({state})
initiateDistrict.call({state}, 20, 40)
io.on('connection', handleConnection.bind({state}))
app.use(static_(join(__dirname, 'public')))
server.listen(port, () => console.log('Listening on port ' + port))
refresh(state)
