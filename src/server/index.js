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

const matchingKit = {
  characters: [],
  vehicles: [],
  checkedWalkers: [],
  matchesForCharacter: []
}

const collisionKitByType = {
  collisionKit: {vehiclesA: [], vehiclesB: []},
  interactionKit: {charactersA: [], charactersB: []}
}

const state = {
  tick: 0,
  connectionQueue: [],
  latencyQueue: [],
  inputQueue: [],
  districtKit: getDistrictKit(),
  entityKit: getEntityKit(),
  playerKit: getPlayerKit(),
  matchingKit,
  collisionKitByType
}

const createMayor = function () {
  const {playerKit, entityKit, districtKit} = this
  const playerId = playerKit.create()
  const characterId = entityKit.create('character')
  const districtId = districtKit.create(true)
  playerKit.assignCharacter(playerId, characterId)
  entityKit.assignPlayer(characterId, playerId)
  entityKit.assignDistrict(characterId, districtId)
  return this
}

const initiateDistrict = function (characterCount, vehicleCount) {
  const {districtKit} = this
  const districtId = districtKit.create()
  populate.call(this, 'character', characterCount, districtId)
  populate.call(this, 'vehicle', vehicleCount, districtId)
  return this
}

const populate = function (entityType, count, districtId) {
  const {entityKit, districtKit} = this
  while (count) {
    const entityId = entityKit.create(entityType, districtId)
    const entity = entityKit.clone(entityId)
    districtKit.addToDistrict(entity)
    --count
  }
  return this
}

const handleConnection = function (socket) {
  const {connectionQueue} = this
  const wrappedPlayerId = {}
  connectionQueue.push({socket, wrappedPlayerId})
  socket.on('timestamp', handleTimestamp.bind({...this, wrappedPlayerId}))
  socket.on('input', handleInput.bind({...this, wrappedPlayerId}))
  return this
}

const handleTimestamp = function (timestamp) {
  const {latencyQueue, wrappedPlayerId} = this
  const newTimestamp = now()
  const latency = newTimestamp - timestamp
  latencyQueue.push({latency, wrappedPlayerId})
  return this
}

const handleInput = function (input) {
  const {inputQueue, wrappedPlayerId} = this
  inputQueue.push({input, wrappedPlayerId})
  return this
}

const refresh = function () {
  const {playerKit, entityKit, districtKit} = this
  const activeKit = {walkers: [], drivers: [], passengers: []}
  this.refreshStartTime = now()
  ++this.tick
  const {tick} = this
  runQueues.call(this)
  const playerCharacterIds = playerKit.getPlayerCharacterIds()
  const playerCharacters = entityKit.cloneMultiple(playerCharacterIds)
  const {walkers, drivers, passengers} = playerCharacters.reduce(pushIfActive, activeKit)
  const walkerClones = entityKit.cloneMultiple(walkers)
  const {characters, vehicles} = districtKit.checkVehicleKeyMatches(walkerClones)
  const vehicleEntryKit = entityKit.checkForVehicleEntries(characters, vehicles)
  const {charactersToEnter, vehiclesToBeEntered, nonEntereringWalkers} = vehicleEntryKit
  const puttedKit = entityKit.putCharactersInVehicles(charactersToEnter, vehiclesToBeEntered)
  const {charactersPutInVehicles, vehiclesCharactersWerePutIn, strandedWalkers} = puttedKit
  entityKit.exitVehicles(passengers)
  entityKit.exitVehicles(drivers)
  const characters_ = entityKit.cloneMultiple(drivers, nonEntereringWalkers, strandedWalkers)
  districtKit.addToGrid(characters_)
  const {collisions, interactions} = districtKit.detectCollisions(characters_)
  if (collisions && collisions.length) var collidedVehicles = collideVehicles(collisions)
  if (interactions && interactions.length) var interacted = makeCharactersInteract(interactions)
  entityKit.cloneMultiple(
    charactersPutInVehicles, vehiclesCharactersWerePutIn, collidedVehicles, interacted
  )
  const playerCharacterIds_ = playerKit.getPlayerCharacterIds()
  const playerCharacters_ = entityKit.cloneMultiple(playerCharacterIds_)
  entityKit.cloneAll()
  const allPlayers = playerKit.cloneAll()
  updateActive.call(this, allPlayers)
  walkOrDrive.call(this, playerCharacters_, allPlayers)
  const allDistricts = districtKit.cloneAll()
  entityKit.updateLocations(allDistricts)
  if (tick % 3) return setDelay.call(this) && this
  const latencies = playerKit.getLatencies()
  entityKit.updateLatencies(latencies)
  entityKit.emit(io)
  setDelay.call(this)
  return this
}

const pushIfActive = (activeKit, character) => {
  const {walkers, drivers, passengers} = activeKit
  const {active, driving, passenging, id: characterId} = character
  if (active >= 30 && driving) (character.active = 0) || drivers.push(characterId)
  else if (active >= 30 && passenging) (character.active = 0) || passengers.push(characterId)
  else if (active >= 30) (character.active = 0) || walkers.push(characterId)
  return activeKit
}

function collideVehicles({vehiclesA, vehiclesB}) { // eslint-disable-line no-unused-vars
}

function makeCharactersInteract({charactersA, charactersB}) { // eslint-disable-line no-unused-vars
}

const updateActive = function (allPlayers) {
  const {entityKit} = this
  allPlayers.forEach(player => {
    const {id: playerId, input, character} = player
    if (!playerId) return
    if (input.action) entityKit.active(character)
    else entityKit.inactive(character)
    entityKit.clone(character)
  })
  return this
}

const walkOrDrive = function (playerCharacters, allPlayers) {
  const {entityKit} = this
  playerCharacters.forEach(character => {
    const {player, driving, passenging, id} = character
    const {input} = allPlayers[player]
    if (driving) entityKit.drive(id, input)
    else if (!passenging) entityKit.walk(id, input)
  })
  return this
}

const setDelay = function () { // #refactor
  const refreshWithState = refresh.bind(this)
  if (!this.setDelay) this.setDelay = {}
  var _ = this.setDelay
  if (!_.loopStartTime) _.loopStartTime = now() - 1000 / 60
  if (!_.millisecondsAhead) _.millisecondsAhead = 0
  var refreshDuration = now() - this.refreshStartTime
  var loopDuration = now() - _.loopStartTime
  _.loopStartTime = now()
  var delayDuration = loopDuration - refreshDuration
  if (_.checkForSlowdown) {
    if (delayDuration > _.delay * 1.2) {
      _.slowdownCompensation = _.delay / delayDuration
      _.slowdownConfirmed = true
    }
  }
  var millisecondsPerFrame = 1000 / 60
  _.millisecondsAhead += millisecondsPerFrame - loopDuration
  _.delay = millisecondsPerFrame + _.millisecondsAhead - refreshDuration
  clearTimeout(_.timeout)
  if (_.delay < 5) {
    _.checkForSlowdown = false
    refreshWithState()
  }
  else {
    if (_.slowdownConfirmed) {
      _.delay = _.delay * _.slowdownCompensation
      if (_.delay < 14) {
        if (_.delay < 7) {
          refreshWithState()
        }
        else {
          _.checkForSlowdown = true
          _.slowdownConfirmed = false
          _.timeout = setTimeout(refreshWithState, 0)
        }
      }
      else {
        _.checkForSlowdown = true
        _.slowdownConfirmed = false
        var delay = Math.round(_.delay)
        _.timeout = setTimeout(refreshWithState, delay - 2)
      }
    }
    else {
      _.checkForSlowdown = true
      delay = Math.round(_.delay - 2)
      _.timeout = setTimeout(refreshWithState, delay)
    }
  }
  return this
}

const runQueues = function () {
  const {playerKit, connectionQueue, latencyQueue, inputQueue} = this
  const {updateLatencyBuffer, updateInput} = playerKit
  connectionQueue.forEach(initiatePlayer, this)
  latencyQueue.forEach(updateLatencyBuffer)
  inputQueue.forEach(updateInput)
  connectionQueue.length = 0
  latencyQueue.length = 0
  inputQueue.length = 0
  return this
}

const initiatePlayer = function ({socket, wrappedPlayerId}) {
  const {playerKit, districtKit, entityKit} = this
  const {id: socketId} = socket
  const playerId = wrappedPlayerId.playerId = playerKit.create(socketId)
  const districtId = districtKit.choose() || initiateDistrict.call(state)
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
  return this
}

const getVehicleX = function (characterX) {
  const distance = Math.random() * (1000 - 200) + 200
  const sides = ['left', 'right']
  const random = Math.random()
  const index = Math.floor(random * sides.length)
  const side = sides[index]
  return side === 'left' ? characterX - distance : characterX + distance
}

createMayor.call(state)
initiateDistrict.call(state, 20, 40)
io.on('connection', handleConnection.bind(state))
app.use(static_(join(__dirname, 'public')))
server.listen(port, () => console.log('Listening on port ' + port))
refresh.call(state)
