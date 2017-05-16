var express = require('express')
var app = express()
var http = require('http')
var server = http.Server(app)
var socket = require('socket.io')
var io = socket(server)
var path = require('path')
var port = process.env.PORT || 3000
var now = require('performance-now')

var districts = require('./districts')()
var objects = require('./objects')()
var players = require('./players')()

var _ = {
  tick: 0
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
      var objectID = objects.create(objectType, districtID, districts)
      districts.populate(objectID, objects)
      populated++
    }
  }
}

function initiatePlayer(socket) {
  var playerID = players.create(socket.id)
  var districtID = districts.choose()
  if (!districtID) districtID = initiateDistrict()
  var characterID = objects.create('character', districtID, districts)
  players.assignCharacter(playerID, characterID)
  socket.join(districtID.toString())
  objects.assignPlayer(characterID, playerID)
  objects.assignDistrict(characterID, districtID)
  var vehicleX = getVehicleX(characterID)
  var vehicleID = objects.create('vehicle', districtID, districts, vehicleX, 7843, 0)
  objects.makeOwner(characterID, vehicleID)
  objects.giveKey(characterID, vehicleID)
  console.log(objects[characterID]);
  districts.populate(characterID, objects)
  districts.populate(vehicleID, objects)
  players.emit(playerID, socket)
  districts.emit(districtID, socket)
  broadcastObjectToDistrict(objects[characterID], districtID)
  broadcastObjectToDistrict(objects[vehicleID], districtID)
}

function getVehicleX(characterID) {
  var character = objects[characterID]
  var distance = Math.random() * (1000 - 200) + 200
  var sides = ['left', 'right']
  var side = sides[Math.floor(Math.random() * sides.length)]
  return (side === 'left') ? character.x - distance : character.x + distance
}

function broadcastObjectToDistrict(object, districtID) {
  io.to(districtID.toString()).emit('object', object)
}

function refresh() {
  _.refreshStartTime = now()
  _.tick += 1
  districts.refresh()
  players.refresh()
  objects.refresh()
  var playerCharacterIDs = players.playerCharacterIDs
  var active = objects.updatePlayerCharactersBehavior(playerCharacterIDs, players)
  if (active.walkers) var checked = checkForVehicleEntries(active.walkers)
  if (checked && checked.enterers) objects.putCharactersInVehicles(checked.enterers, checked.vehicles)
  if (checked && checked.walkers) districts.addToGrid(checked.walkers, objects)
  if (active.drivers) districts.addToGrid(active.drivers, objects)
  if (active.passengers) makeJumpOut(active.passengers)
  var results = districts.detectCollisions(objects)
  if (results.collisions) collideVehicles(results.collisions)
  if (results.interactions) interactCharacters(results.collisions)
  objects.updateLocations(districts)
  if (!(_.tick % 3)) {
    var latencies = players.getLatencies()
    objects.updateLatencies(latencies)
    objects.emit(io)
  }
  setDelay()
}

function checkForVehicleEntries(playerCharacterIDs) {
  var checked = {}
  playerCharacterIDs.forEach(characterID => {
    var character = objects[characterID]
    var district = districts[character.district]
    var vehicleID = character.vehicleKeys.find(vehicleID => {
      if (district.vehicles[vehicleID]) {
        var vehicle = objects[vehicleID]
        if (vehicle.driver) var driver = 1
        else driver = 0
        return (
          character.x < vehicle.x + vehicle.width &&
          character.x + character.width > vehicle.x &&
          character.y < vehicle.y + vehicle.height &&
          character.y + character.height > vehicle.y &&
          driver + vehicle.passengers < vehicle.seats
        )
      }
    })
    if (vehicleID) {
      if (!checked.enterers) {
        checked.enterers = []
        checked.vehicles = []
      }
      checked.enterers.push(characterID)
      checked.vehicles.push(vehicleID)
    }
    else {
      if (!checked.walkers) checked.walkers = []
      checked.walkers.push(character.id)
    }
  })
  return checked
}

function makeJumpOut(playerCharacterIDs) {
}

function collideVehicles(vehicleIDs) {
}

function interactCharacters(playerCharacterIDs) {
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
  initiatePlayer(socket)

  socket.on('timestamp', timestamp => {
    var playerID = players.getPlayerIDBySocketID(socket.id)
    players.updateLatencyBuffer(playerID, timestamp)
  })

  socket.on('input', input => {
    var playerID = players.getPlayerIDBySocketID(socket.id)
    players.updateInput(input, playerID)
  })
})

initiateDistrict()

app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => {
  console.log('Listening on port 3000.')
})

refresh()
