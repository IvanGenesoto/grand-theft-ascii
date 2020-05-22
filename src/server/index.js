import express, {static as static_} from 'express'
import {Server} from 'http'
import socketIo from 'socket.io'
import {join} from 'path'
import now from 'performance-now'
import {getDistrictKit} from './get-district-kit'
import {getCityElementKit} from './get-entity-kit'
import {getPlayerKit} from './get-player-kit'

const app = express()
const server = Server(app)
const io = socketIo(server)
const port = process.env.PORT || 3000
const districts = getDistrictKit()
const cityElements = getCityElementKit()
const players = getPlayerKit()

const _ = {
  tick: 0,
  connectionQueue: [],
  latencyQueue: [],
  inputQueue: [],
  activated: {
    walkers: [],
    drivers: [],
    passengers: []
  }
}

function createMayor() {
  var playerId = players.create()
  var characterId = cityElements.create('character')
  var districtId = districts.create()
  players.assignCharacter(playerId, characterId)
  cityElements.assignPlayer(characterId, playerId)
  cityElements.assignDistrict(characterId, districtId)
}

function initiateDistrict() {
  var districtId = districts.create('neon')
  massPopulateDistrict(districtId)
  return districtId
}

function massPopulateDistrict(districtId) {
  var population = {
    character: 20,
    vehicle: 40
  }
  for (var objectType in population) {
    var number = population[objectType]
    var populated = 0
    while (populated < number) {
      var objectId = cityElements.create(objectType, districtId)
      var object = cityElements.clone(objectId)
      districts.addToDistrict(object)
      populated++
    }
  }
}

function runQueues() {
  var {connectionQueue, latencyQueue, inputQueue} = _
  connectionQueue.forEach(connection => initiatePlayer(connection))
  latencyQueue.forEach(({latency, socket}) => {
    var playerId = players.getPlayerIdBySocketId(socket.id)  // #refactor: Pass player Id to/from client and use if socket is match.
    players.updateLatencyBuffer(playerId, latency)
  })
  inputQueue.forEach(({input, socket}) => {
    var playerId = players.getPlayerIdBySocketId(socket.id)
    players.updateInput(input, playerId)
  })
  _.connectionQueue.length = 0
  _.latencyQueue.length = 0
  _.inputQueue.length = 0
}

function initiatePlayer(socket) {
  var playerId = players.create(socket.id)
  var districtId = districts.choose()
  if (!districtId) districtId = initiateDistrict()
  var characterId = cityElements.create('character', districtId)
  players.assignCharacter(playerId, characterId)
  socket.join(districtId.toString())
  cityElements.assignPlayer(characterId, playerId)
  var character = cityElements.clone(characterId)
  var vehicleX = getVehicleX(character)
  var vehicleId = cityElements.create('vehicle', districtId, vehicleX, 7843, 0)
  cityElements.giveKey(characterId, vehicleId, 'masterKey')
  var vehicle = cityElements.clone(vehicleId)
  character = cityElements.clone(characterId)
  districts.addToDistrict(character)
  districts.addToDistrict(vehicle)
  players.emit(playerId, socket)
  districts.emit(districtId, socket)
  emitCityElementToDistrict(character, districtId)
  emitCityElementToDistrict(vehicle, districtId)
}

function getVehicleX(character) {
  var distance = Math.random() * (1000 - 200) + 200
  var sides = ['left', 'right']
  var side = sides[Math.floor(Math.random() * sides.length)]
  return (side === 'left') ? character.x - distance : character.x + distance
}

function emitCityElementToDistrict(cityElement, districtId) {
  io.to(districtId.toString()).emit('cityElement', cityElement)
}

function refresh() {
  _.refreshStartTime = now()
  _.tick += 1
  runQueues()

  var playerCharacterIds = players.getPlayerCharacterIds()
  var playerCharacters = cityElements.cloneMultiple(playerCharacterIds)
  var activated = checkIfActive(playerCharacters)
  var {walkers, drivers, passengers} = activated

  var walkerClones = cityElements.cloneMultiple(walkers)
  if (walkerClones && walkerClones.length) var matches = districts.checkVehicleKeyMatches(walkerClones)
  if (matches) var {characters, vehicles} = matches
  if (characters && characters.length) var checked = cityElements.checkForVehicleEntries(characters, vehicles)
  if (checked) var {charactersToEnter, vehiclesToBeEntered, nonEntereringWalkers} = checked
  if (charactersToEnter && charactersToEnter.length) {
    var putted = cityElements.putCharactersInVehicles(charactersToEnter, vehiclesToBeEntered)
  }

  if (putted) var {charactersPutInVehicles, vehiclesCharactersWerePutIn, strandedWalkers} = putted
  var driverClones = cityElements.cloneMultiple(drivers)
  if (passengers && passengers.length) cityElements.exitVehicles(passengers)
  if (driverClones && driverClones.length) cityElements.exitVehicles(drivers)
  var collection = cityElements.cloneMultiple(drivers, nonEntereringWalkers, strandedWalkers)
  districts.addToGrid(collection)

  var detected = districts.detectCollisions(collection)
  if (detected) var {collisions, interactions} = detected
  if (collisions && collisions.length) var collidedVehicles = collideVehicles(collisions)
  if (interactions && interactions.length) var interacted = makeCharactersInteract(interactions)
  cityElements.cloneMultiple(charactersPutInVehicles,
    vehiclesCharactersWerePutIn, collidedVehicles, interacted)

  playerCharacterIds = players.getPlayerCharacterIds()
  playerCharacters = cityElements.cloneMultiple(playerCharacterIds)
  cityElements.cloneAll()
  var allPlayers = players.cloneAll()
  updateActive(allPlayers)
  walkOrDrive(playerCharacters, allPlayers)
  var allDistricts = districts.cloneAll()
  cityElements.updateLocations(allDistricts)

  if (!(_.tick % 3)) {
    var latencies = players.getLatencies()
    cityElements.updateLatencies(latencies)
    cityElements.emit(io)
  }
  setDelay()
}

function checkIfActive(playerCharacters) {
  var {walkers, drivers, passengers} = _.activated
  walkers.length = 0
  drivers.length = 0
  passengers.length = 0
  playerCharacters.forEach(playerCharacter => {

    var {active, driving, passenging, id} = playerCharacter
    if (active >= 30 && driving) {
      playerCharacter.active = 0
      drivers.push(id)
    }
    else if (active >= 30 && passenging) {
      playerCharacter.active = 0
      passengers.push(id)
    }
    else if (active >= 30) {
      playerCharacter.active = 0
      walkers.push(id)
    }
  })

  return _.activated
}

function collideVehicles({vehiclesA, vehiclesB}) { // eslint-disable-line no-unused-vars
}

function makeCharactersInteract({charactersA, charactersB}) { // eslint-disable-line no-unused-vars
}

function updateActive(allPlayers) {
  allPlayers.forEach(player => {
    var {id, input, character} = player
    if (id) {
      if (input.action) cityElements.active(character)
      else cityElements.inactive(character)
      cityElements.clone(character)
    }
  })
}

function walkOrDrive(playerCharacters, allPlayers) {
  playerCharacters.forEach(character => {
    var {player, driving, passenging, id} = character
    var input = allPlayers[player].input
    if (driving) cityElements.drive(id, input)
    else if (!passenging) {
      cityElements.walk(id, input)
    }
  })
}

function setDelay() {
  if (!_.setDelay) _.setDelay = {}
  var __ = _.setDelay
  if (!__.loopStartTime) __.loopStartTime = now() - 1000 / 60
  if (!__.millisecondsAhead) __.millisecondsAhead = 0
  var refreshDuration = now() - _.refreshStartTime
  var loopDuration = now() - __.loopStartTime
  __.loopStartTime = now()
  var delayDuration = loopDuration - refreshDuration
  if (__.checkForSlowdown) {
    if (delayDuration > __.delay * 1.2) {
      __.slowdownCompensation = __.delay / delayDuration
      __.slowdownConfirmed = true
    }
  }
  var millisecondsPerFrame = 1000 / 60
  __.millisecondsAhead += millisecondsPerFrame - loopDuration
  __.delay = millisecondsPerFrame + __.millisecondsAhead - refreshDuration
  clearTimeout(__.timeout)
  if (__.delay < 5) {
    __.checkForSlowdown = false
    refresh()
  }
  else {
    if (__.slowdownConfirmed) {
      __.delay = __.delay * __.slowdownCompensation
      if (__.delay < 14) {
        if (__.delay < 7) {
          refresh()
        }
        else {
          __.checkForSlowdown = true
          __.slowdownConfirmed = false
          __.timeout = setTimeout(refresh, 0)
        }
      }
      else {
        __.checkForSlowdown = true
        __.slowdownConfirmed = false
        var delay = Math.round(__.delay)
        __.timeout = setTimeout(refresh, delay - 2)
      }
    }
    else {
      __.checkForSlowdown = true
      delay = Math.round(__.delay - 2)
      __.timeout = setTimeout(refresh, delay)
    }
  }
}

io.on('connection', socket => {
  _.connectionQueue.push(socket)

  socket.on('timestamp', timestamp => {
    var newTimestamp = now()
    var latency = newTimestamp - timestamp
    _.latencyQueue.push({latency, socket})
  })

  socket.on('input', input => {
    _.inputQueue.push({input, socket})
  })
})

createMayor()
initiateDistrict()

app.use(static_(join(__dirname, 'public')))
server.listen(port, () => {
  console.log('Listening on port 3000.')
})

refresh()
