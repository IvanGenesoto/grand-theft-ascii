const express = require('express')
const app = express()
const http = require('http')
const server = http.Server(app)
const socket = require('socket.io')
const io = socket(server)
const path = require('path')
const port = process.env.PORT || 3000
const now = require('performance-now')

const districts = require('./districts')()
const cityElements = require('./city-elements')()
const players = require('./players')()

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
  var playerID = players.create()
  var characterID = cityElements.create('character')
  var districtID = districts.create()
  players.assignCharacter(playerID, characterID)
  cityElements.assignPlayer(characterID, playerID)
  cityElements.assignDistrict(characterID, districtID)
}

function initiateDistrict() {
  var districtID = districts.create('neon')
  massPopulateDistrict(districtID)
  return districtID
}

function massPopulateDistrict(districtID) {
  var population = {
    character: 20,
    vehicle: 40
  }
  for (var objectType in population) {
    var number = population[objectType]
    var populated = 0
    while (populated < number) {
      var objectID = cityElements.create(objectType, districtID)
      var object = cityElements.clone(objectID)
      districts.addToDistrict(object)
      populated++
    }
  }
}

function runQueues() {
  var {connectionQueue, latencyQueue, inputQueue} = _
  connectionQueue.forEach(connection => initiatePlayer(connection))
  latencyQueue.forEach(({latency, socket}) => {
    var playerID = players.getPlayerIDBySocketID(socket.id)  // #refactor: Pass player ID to/from client and use if socket is match.
    players.updateLatencyBuffer(playerID, latency)
  })
  inputQueue.forEach(({input, socket}) => {
    var playerID = players.getPlayerIDBySocketID(socket.id)
    players.updateInput(input, playerID)
  })
  _.connectionQueue.length = 0
  _.latencyQueue.length = 0
  _.inputQueue.length = 0
}

function initiatePlayer(socket) {
  var playerID = players.create(socket.id)
  var districtID = districts.choose()
  if (!districtID) districtID = initiateDistrict()
  var characterID = cityElements.create('character', districtID)
  players.assignCharacter(playerID, characterID)
  socket.join(districtID.toString())
  cityElements.assignPlayer(characterID, playerID)
  var character = cityElements.clone(characterID)
  var vehicleX = getVehicleX(character)
  var vehicleID = cityElements.create('vehicle', districtID, vehicleX, 7843, 0)
  cityElements.giveKey(characterID, vehicleID, 'masterKey')
  var vehicle = cityElements.clone(vehicleID)
  character = cityElements.clone(characterID)
  districts.addToDistrict(character)
  districts.addToDistrict(vehicle)
  players.emit(playerID, socket)
  districts.emit(districtID, socket)
  emitCityElementToDistrict(character, districtID)
  emitCityElementToDistrict(vehicle, districtID)
}

function getVehicleX(character) {
  var distance = Math.random() * (1000 - 200) + 200
  var sides = ['left', 'right']
  var side = sides[Math.floor(Math.random() * sides.length)]
  return (side === 'left') ? character.x - distance : character.x + distance
}

function emitCityElementToDistrict(cityElement, districtID) {
  io.to(districtID.toString()).emit('cityElement', cityElement)
}

function refresh() {
  _.refreshStartTime = now()
  _.tick += 1
  runQueues()

  var playerCharacterIDs = players.getPlayerCharacterIDs()
  var playerCharacters = cityElements.cloneMultiple(playerCharacterIDs)
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

  playerCharacterIDs = players.getPlayerCharacterIDs()
  playerCharacters = cityElements.cloneMultiple(playerCharacterIDs)
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

function collideVehicles({vehiclesA, vehiclesB}) {
}

function makeCharactersInteract({charactersA, charactersB}) {
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

app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => {
  console.log('Listening on port 3000.')
})

refresh()
