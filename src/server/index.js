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
const objects = require('./objects')()
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
  var characterID = objects.create('character')
  var districtID = districts.create()
  players.assignCharacter(playerID, characterID)
  objects.assignPlayer(characterID, playerID)
  objects.assignDistrict(characterID, districtID)
}

function initiateDistrict() {
  var districtID = districts.create('neon')
  massPopulateDistrict(districtID)
  return districtID
}

function massPopulateDistrict(districtID) {
  var population = {
    character: 200,
    vehicle: 500
  }
  for (var objectType in population) {
    var number = population[objectType]
    var populated = 0
    while (populated < number) {
      var objectID = objects.create(objectType, districtID)
      var object = objects.clone(objectID)
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
}

function initiatePlayer(socket) {
  var playerID = players.create(socket.id)
  var districtID = districts.choose()
  if (!districtID) districtID = initiateDistrict()
  var characterID = objects.create('character', districtID)
  players.assignCharacter(playerID, characterID)
  socket.join(districtID.toString())
  objects.assignPlayer(characterID, playerID)
  var character = objects.clone(characterID)
  var vehicleX = getVehicleX(character)
  var vehicleID = objects.create('vehicle', districtID, vehicleX, 7843, 0)
  objects.giveKey(characterID, vehicleID, 'masterKey')
  var vehicle = objects.clone(vehicleID)
  character = objects.clone(characterID)
  districts.addToDistrict(character, vehicle)
  players.emit(playerID, socket)
  districts.emit(districtID, socket)
  emitObjectToDistrict(character, districtID)
  emitObjectToDistrict(vehicle, districtID)
}

function getVehicleX(character) {
  var distance = Math.random() * (1000 - 200) + 200
  var sides = ['left', 'right']
  var side = sides[Math.floor(Math.random() * sides.length)]
  return (side === 'left') ? character.x - distance : character.x + distance
}

function emitObjectToDistrict(object, districtID) {
  io.to(districtID.toString()).emit('object', object)
}

function refresh() {
  _.refreshStartTime = now()
  _.tick += 1
  runQueues()

  var playerCharacterIDs = players.getPlayerCharacterIDs()
  var playerCharacters = objects.cloneMultiple(playerCharacterIDs)
  checkIfActive(playerCharacters)
  var {walkers, drivers, passengers} = active
  var jumpers = makeJumpOut(passengers)
  var walkerClones = objects.cloneMultiple(walkers)
  var matches = districts.checkVehicleKeyMatches(walkerClones)
  var checked = checkForVehicleEntries(matches)
  var {charactersToEnter, vehiclesToBeEntered, nonEntereringWalkers} = checked
  var putted = objects.putCharactersInVehicles(charactersToEnter, vehiclesToBeEntered)
  var {charactersPutInVehicles, vehiclesCharactersWerePutIn, strandedWalkers} = putted
  var collection = objects.cloneMultiple(drivers, walkers, nonEntereringWalkers, strandedWalkers)
  districts.addToGrid(collection)
  var allObjects = objects.cloneAll()
  var detected = districts.detectCollisions(allObjects)
  var {collisions, interactions} = detected
  var collidedVehicles = collideVehicles(collisions)
  var interacted = makeCharactersInteract(interactions)
  collection = objects.cloneMultiple(jumpers, charactersPutInVehicles,
    vehiclesCharactersWerePutIn, collidedVehicles, interacted)

  objects.walk()
  objects.drive()
  objects.updateLocations(districts)
  if (!(_.tick % 3)) {
    var latencies = players.getLatencies()
    objects.updateLatencies(latencies)
    objects.emit(io)
  }
  setDelay()
}

function checkIfActive(playerCharacterID) {
  var {walkers, drivers, passengers} = active

  walkers.length = 0
  drivers.length = 0
  passengers.length = 0

  playerCharacterID.forEach(playerCharacter => {
    var {active, driving, passenging, id} = playerCharacter
    switch (true) {
      case active && driving: drivers.push(id); break
      case active && passenging: passengers.push(id); break
      case active: walkers.push(id); break
      default:
    }
  })
  return active
}

function checkForVehicleEntries(matches) {
}

function makeJumpOut(playerCharacterIDs) {
}

function collideVehicles(vehicleIDs) {
}

function makeCharactersInteract(playerCharacterIDs) {
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
