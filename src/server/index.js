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
  timestampQueue: [],
  inputQueue: []
}

const active = {
  walkers: [],
  drivers: [],
  passengers: []
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
    character: 100,
    vehicle: 500
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
  var {connectionQueue, timestampQueue, inputQueue} = _
  connectionQueue.forEach(connection => initiatePlayer(connection))
  timestampQueue.forEach(({timestamp, socket}) => {
    var playerID = players.getPlayerIDBySocketID(socket.id)
    players.updateLatencyBuffer(playerID, timestamp)
  })
  inputQueue.forEach(({input, socket}) => {
    var playerID = players.getPlayerIDBySocketID(socket.id)
    players.updateInput(input, playerID)
  })
  _.connectionQueue.length = 0
  _.timestampQueue.length = 0
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
  checkIfActive(playerCharacters)

  if (active) var {walkers, drivers, passengers} = active
  if (passengers && passengers.length) var jumpers = makeJumpOut(passengers)
  var walkerClones = cityElements.cloneMultiple(walkers)
  if (walkerClones && walkerClones.length) var matches = districts.checkVehicleKeyMatches(walkerClones)
  if (matches) var {characters, vehicles} = matches
  if (characters && characters.length) var checked = cityElements.checkForVehicleEntries(characters, vehicles)
  if (checked) var {charactersToEnter, vehiclesToBeEntered, nonEntereringWalkers} = checked
  if (charactersToEnter && charactersToEnter.length) {
    var putted = cityElements.putCharactersInVehicles(charactersToEnter, vehiclesToBeEntered)
  }

  if (putted) var {charactersPutInVehicles, vehiclesCharactersWerePutIn, strandedWalkers} = putted
  var collection = cityElements.cloneMultiple(drivers, nonEntereringWalkers, strandedWalkers)
  districts.addToGrid(collection)
  var detected = districts.detectCollisions(collection)
  if (detected) var {collisions, interactions} = detected
  if (collisions && collisions.length) var collidedVehicles = collideVehicles(collisions)
  if (interactions && interactions.length) var interacted = makeCharactersInteract(interactions)
  cityElements.cloneMultiple(jumpers, charactersPutInVehicles,
    vehiclesCharactersWerePutIn, collidedVehicles, interacted)

  playerCharacterIDs = players.getPlayerCharacterIDs()
  playerCharacters = cityElements.cloneMultiple(playerCharacterIDs)
  cityElements.cloneAll()
  var allPlayers = players.cloneAll()
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
  var {walkers, drivers, passengers} = active
  walkers.length = 0
  drivers.length = 0
  passengers.length = 0
  playerCharacters.forEach(playerCharacter => {
    var {action, driving, passenging, id} = playerCharacter
    switch (true) {
      case action && driving: drivers.push(id); break
      case action && passenging: passengers.push(id); break
      case action:
        walkers.push(id)
        break
      default:
    }
  })
  return active
}

function makeJumpOut(playerCharacterIDs) {
}

function collideVehicles({vehiclesA, vehiclesB}) {
}

function makeCharactersInteract({charactersA, charactersB}) {
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
    _.timestampQueue.push({timestamp, socket})
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
