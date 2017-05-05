var express = require('express')
var app = express()
var http = require('http')
var server = http.Server(app)
var socket = require('socket.io')
var io = socket(server)
var path = require('path')
var port = process.env.PORT || 3000

var layerY
var tick = 0

var id = {
  vehicle: 0,
  key: 0,
  element: 0,
  player: 0,
  character: 0
}

var broadcasts = {
  '1': {}
}

var players = {}

var districts = {
  '1': {
    timestamp: 0,
    tick: 0,
    id: 1,
    name: 'District 1',
    characterCount: 0,
    vehicleCount: 0,
    width: 32000,
    height: 8000,
    element: 'canvas',
    backgrounds: {
      '1': {
        id: 1,
        blueprints: [],
        element: 'canvas',
        width: 16000,
        height: 8000,
        depth: 4,
        sections: {
          '1': {
            id: 1,
            rows: 1,
            variations: {
              '1': {
                id: 1,
                prevalence: 1,
                element: 'img',
                src: 'images/background/far/above-top.png',
                width: 1024,
                height: 367
              }
            }
          },
          '2': {
            id: 2,
            rows: 1,
            variations: {
              '1': {
                id: 1,
                prevalence: 4,
                element: 'img',
                src: 'images/background/far/top/top.png',
                width: 1024,
                height: 260
              },
              '2': {
                id: 2,
                prevalence: 1,
                element: 'img',
                src: 'images/background/far/top/top-pink-jumbotron-left.png',
                width: 1024,
                height: 260
              },
              '3': {
                id: 3,
                prevalence: 2,
                element: 'img',
                src: 'images/background/far/top/top-pink-jumbotron-right.png',
                width: 1024,
                height: 260
              }
            }
          },
          '3': {
            id: 3,
            rows: 48,
            variations: {
              '1': {
                id: 1,
                prevalence: 3,
                element: 'img',
                src: 'images/background/far/middle/middle.png',
                width: 1024,
                height: 134
              },
              '2': {
                id: 2,
                prevalence: 2,
                element: 'img',
                src: 'images/background/far/middle/middle-pink-jumbotron-far-left.png',
                width: 1024,
                height: 134
              },
              '3': {
                id: 3,
                prevalence: 1,
                element: 'img',
                src: 'images/background/far/middle/middle-pink-jumbotron-left.png',
                width: 1024,
                height: 134
              },
              '4': {
                id: 4,
                prevalence: 1,
                element: 'img',
                src: 'images/background/far/middle/middle-pink-jumbotron-mid-left.png',
                width: 1024,
                height: 134
              },
              '5': {
                id: 5,
                prevalence: 2,
                element: 'img',
                src: 'images/background/far/middle/middle-pink-jumbotron-middle.png',
                width: 1024,
                height: 134
              },
              '6': {
                id: 6,
                prevalence: 2,
                element: 'img',
                src: 'images/background/far/middle/middle-pink-jumbotron-right.png',
                width: 1024,
                height: 134
              },
              '7': {
                id: 7,
                prevalence: 3,
                element: 'img',
                src: 'images/background/far/middle/middle-blue-jumbotron-left.png',
                width: 1024,
                height: 134
              },
              '8': {
                id: 8,
                prevalence: 2,
                element: 'img',
                src: 'images/background/far/middle/middle-blue-jumbotron-middle.png',
                width: 1024,
                height: 134
              },
              '9': {
                id: 9,
                prevalence: 3,
                element: 'img',
                src: 'images/background/far/middle/middle-blue-jumbotron-right.png',
                width: 1024,
                height: 134
              }
            }
          },
          '4': {
            id: 4,
            rows: 1,
            variations: {
              '1': {
                id: 1,
                prevalence: 1,
                element: 'img',
                src: 'images/background/far/bottom.png',
                width: 1024,
                height: 673
              }
            }
          }
        }
      },
      '2': {
        id: 2,
        blueprints: [],
        y: 7050,
        element: 'canvas',
        width: 24000,
        height: 8000,
        depth: 2,
        sections: {
          '1': {
            id: 1,
            rows: 1,
            variations: {
              '1': {
                id: 1,
                width: 1024,
                height: 768,
                prevalence: 1,
                element: 'img',
                src: 'images/background/middle.png'
              }
            }
          }
        }
      },
      '3': {
        id: 3,
        blueprints: [],
        y: 7232,
        element: 'canvas',
        width: 32000,
        height: 8000,
        depth: 1,
        sections: {
          '1': {
            id: 1,
            rows: 1,
            variations: {
              '1': {
                id: 1,
                width: 1408,
                height: 768,
                prevalence: 1,
                element: 'img',
                src: 'images/background/near.png'
              }
            }
          }
        }
      }
    },
    foregrounds: {
      '1': {
        id: 1,
        blueprints: [],
        x: 0,
        y: 7456,
        width: 32000,
        height: 8000,
        depth: 0.5,
        element: 'canvas',
        scale: 16,
        sections: {
          '1': {
            id: 1,
            rows: 1,
            variations: {
              '1': {
                id: 1,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/lamp/left.png',
                width: 144,
                height: 544
              },
              '2': {
                id: 2,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/lamp/right.png',
                width: 144,
                height: 544
              }
            }
          }
        }
      },
      '2': {
        id: 2,
        blueprints: [],
        x: 32000,
        y: 7456,
        width: 32000,
        height: 8000,
        depth: 0.5,
        element: 'canvas',
        scale: 16,
        sections: {
          '1': {
            id: 1,
            rows: 1,
            variations: {
              '1': {
                id: 1,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/lamp/left.png',
                width: 144,
                height: 544
              },
              '2': {
                id: 2,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/lamp/right.png',
                width: 144,
                height: 544
              }
            }
          }
        }
      },
      '3': {
        id: 3,
        blueprints: [],
        x: 0,
        y: 6800,
        width: 32000,
        height: 8000,
        depth: 0.25,
        element: 'canvas',
        scale: 64,
        sections: {
          '1': {
            id: 1,
            rows: 1,
            variations: {
              '1': {
                id: 1,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/up-left.png',
                width: 448,
                height: 1248
              },
              '2': {
                id: 2,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/up-right.png',
                width: 448,
                height: 1248
              },
              '3': {
                id: 3,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/down-left.png',
                width: 448,
                height: 1248
              },
              '4': {
                id: 4,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/down-right.png',
                width: 448,
                height: 1248
              },
              '5': {
                id: 5,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/left-up.png',
                width: 1248,
                height: 448
              },
              '6': {
                id: 6,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/left-down.png',
                width: 1248,
                height: 448
              },
              '7': {
                id: 7,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/right-up.png',
                width: 1248,
                height: 448
              },
              '8': {
                id: 8,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/right-down.png',
                width: 1248,
                height: 448
              }
            }
          }
        }
      },
      '4': {
        id: 4,
        blueprints: [],
        x: 32000,
        y: 6800,
        width: 32000,
        height: 8000,
        depth: 0.25,
        element: 'canvas',
        scale: 64,
        sections: {
          '1': {
            id: 1,
            rows: 1,
            variations: {
              '1': {
                id: 1,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/up-left.png',
                width: 448,
                height: 1248
              },
              '2': {
                id: 2,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/up-right.png',
                width: 448,
                height: 1248
              },
              '3': {
                id: 3,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/down-left.png',
                width: 448,
                height: 1248
              },
              '4': {
                id: 4,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/down-right.png',
                width: 448,
                height: 1248
              },
              '5': {
                id: 5,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/left-up.png',
                width: 1248,
                height: 448
              },
              '6': {
                id: 6,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/left-down.png',
                width: 1248,
                height: 448
              },
              '7': {
                id: 7,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/right-up.png',
                width: 1248,
                height: 448
              },
              '8': {
                id: 8,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/right-down.png',
                width: 1248,
                height: 448
              }
            }
          }
        }
      },
      '5': {
        id: 5,
        blueprints: [],
        x: 64000,
        y: 6800,
        width: 32000,
        height: 8000,
        depth: 0.25,
        element: 'canvas',
        scale: 64,
        sections: {
          '1': {
            id: 1,
            rows: 1,
            variations: {
              '1': {
                id: 1,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/up-left.png',
                width: 448,
                height: 1248
              },
              '2': {
                id: 2,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/up-right.png',
                width: 448,
                height: 1248
              },
              '3': {
                id: 3,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/down-left.png',
                width: 448,
                height: 1248
              },
              '4': {
                id: 4,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/down-right.png',
                width: 448,
                height: 1248
              },
              '5': {
                id: 5,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/left-up.png',
                width: 1248,
                height: 448
              },
              '6': {
                id: 6,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/left-down.png',
                width: 1248,
                height: 448
              },
              '7': {
                id: 7,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/right-up.png',
                width: 1248,
                height: 448
              },
              '8': {
                id: 8,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/right-down.png',
                width: 1248,
                height: 448
              }
            }
          }
        }
      },
      '6': {
        id: 6,
        blueprints: [],
        x: 96000,
        y: 6800,
        width: 32000,
        height: 8000,
        depth: 0.25,
        element: 'canvas',
        scale: 64,
        sections: {
          '1': {
            id: 1,
            rows: 1,
            variations: {
              '1': {
                id: 1,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/up-left.png',
                width: 448,
                height: 1248
              },
              '2': {
                id: 2,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/up-right.png',
                width: 448,
                height: 1248
              },
              '3': {
                id: 3,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/down-left.png',
                width: 448,
                height: 1248
              },
              '4': {
                id: 4,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/down-right.png',
                width: 448,
                height: 1248
              },
              '5': {
                id: 5,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/left-up.png',
                width: 1248,
                height: 448
              },
              '6': {
                id: 6,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/left-down.png',
                width: 1248,
                height: 448
              },
              '7': {
                id: 7,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/right-up.png',
                width: 1248,
                height: 448
              },
              '8': {
                id: 8,
                prevalence: 1,
                element: 'img',
                src: 'images/foreground/arrow/right-down.png',
                width: 1248,
                height: 448
              }
            }
          }
        }
      }
    },
    rooms: {
      room1: {
        id: 1,
        key: '',
        viewingKey: undefined,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        element: 'canvas',
        background: undefined,
        foreground: undefined,
        scenery: {
          background: undefined,
          foreground: undefined
        },
        inventory: undefined
      }
    },
    characters: {},
    aiCharacters: {
      '1': {
        id: 1,
        name: '',
        vehicle: 0,
        room: 0,
        keys: [],
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        direction: 'east',
        speed: 0,
        maxSpeed: 0,
        acceleration: 0,
        frames: {}
      }
    },
    vehicles: {},
    projectiles: {
      '1': {
        x: 0,
        y: 0,
        speed: 0,
        type: undefined
      }
    },
    scenery: {
      background: {
        '1': {
          x: 0,
          y: 0
        }
      },
      foreground: {
        '1': {
          x: 0,
          y: 0
        }
      }
    }
  }
}

function populateDistrict(districtID) {
  populateWithCharacters(districtID)
  populateWithVehicles(districtID)
}

function populateWithCharacters(districtID) {
  var district = districts[districtID]
  if (district.characterCount < 200) {
    district.characterCount += 1
    var character = createAICharacter(districtID)
    district.characters[character.id] = character
    populateWithCharacters(districtID)
  }
}

function createAICharacter(districtID) {
  var directions = ['left', 'right', 'left', 'right', 'left', 'right']
  var directionIndex = Math.floor(Math.random() * directions.length)
  var character = {
    id: id.character += 1,
    name: '',
    room: 0,
    keys: [],
    y: 7832,
    width: 105,
    height: 155,
    direction: directions[directionIndex],
    speed: Math.floor(Math.random() * 15),
    maxSpeed: 0,
    acceleration: 0,
    element: 'img',
    src: 'images/characters/man.png'
  }
  character.x = Math.floor(Math.random() * (districts[districtID].width - character.width))
  return character
}

function populateWithVehicles(districtID) {
  var district = districts[districtID]
  if (district.vehicleCount < 500) {
    district.vehicleCount += 1
    var vehicle = createVehicle(districtID)
    district.vehicles[vehicle.id] = vehicle
    populateWithVehicles(districtID)
  }
}

function createVehicle(districtID) {
  var directions = ['left', 'right', 'left', 'right', 'left', 'right']
  var directionIndex = Math.floor(Math.random() * directions.length)
  var vehicle = {
    id: id.vehicle += 1,
    key: id.key += 1,
    width: 268,
    height: 80,
    direction: directions[directionIndex],
    speed: Math.floor(Math.random() * 151),
    maxSpeed: 0,
    acceleration: 0,
    deceleration: 0,
    armor: undefined,
    weight: 0,
    element: 'img',
    src: 'images/vehicles/delorean.png'
  }
  vehicle.x = Math.floor(Math.random() * (districts[districtID].width - vehicle.width))
  vehicle.y = Math.floor(Math.random() * (districts[districtID].height -
    districts[districtID].height / 2 - 168) + districts[districtID].height / 2)
  return vehicle
}

function assignElementIDs(object) {
  for (var property in object) {
    if (property === 'element') {
      var element = {id: id.element += 1}
      object.elementID = '_' + element.id
    }
    else if (
      typeof object[property] !== 'string' &&
      typeof object[property] !== 'number' &&
      typeof object[property] !== 'boolean'
    ) {
      var nestedObject = object[property]
      assignElementIDs(nestedObject)
    }
  }
}

function compose(layersType) {
  for (var districtID in districts) {
    var district = districts[districtID]
    layerY = 0
    for (var layerID in district[layersType]) {
      var layers = district[layersType]
      var layer = layers[layerID]
      for (var sectionID in layer.sections) {
        var section = layer.sections[sectionID]
        var rows = section.rows
        var variationsArray = []
        for (var variationID in section.variations) {
          var variation = section.variations[variationID]
          for (var i = 0; i < variation.prevalence; i++) {
            variationsArray.push(variation)
          }
        }
        createBlueprints(layersType, layer, section, rows, variationsArray)
      }
    }
  }
}

function createBlueprints(layersType, layer, section, rows, variationsArray) {
  var rowsDrawn = 0
  function startRow() {
    var x = 0
    var rowY = 0
    function createBlueprint() {
      if (x < layer.width) {
        var index = Math.floor(Math.random() * variationsArray.length)
        var variation = variationsArray[index]
        if (layer.y) layerY = layer.y
        var blueprint = {section: section.id, variation: variation.id, x, y: layerY}
        layer.blueprints.push(blueprint)
        if (layersType === 'foregrounds') {
          if (layer.id < 3) {
            x += 2000
          }
          else {
            var gap = Math.floor(Math.random() * (3000 - 1000) + 1000)
            x += gap + variation.width
          }
        }
        x += variation.width
        rowY = variation.height
        createBlueprint()
      }
      else {
        rowsDrawn += 1
        layerY += rowY
        startRow()
      }
    }
    if (rowsDrawn < rows) createBlueprint()
  }
  startRow()
}

function initiatePlayer(socket) {
  var player = createPlayer()
  var character = createCharacter()
  var districtID = incrementDistrictCharacterCount()
  player.character = character.id
  player.district = districtID
  character.district = districtID
  players[player.id] = player
  socket.emit('player', player)
  associatePlayerWithSocket(player.id, socket, districtID)
  districts[districtID].characters[character.id] = character
  broadcastCharacterToDistrict(character, districtID)
}

function createPlayer() {
  var player = {
    id: id.player += 1,
    latencies: [],
    input: {
      up: false,
      down: false,
      left: false,
      right: false,
      accelerate: false,
      decelerate: false,
      shoot: false
    }
  }
  return player
}

function createCharacter(name = 'Sam') {
  var elementID = id.element += 1
  var character = {
    id: id.character += 1,
    name,
    vehicle: 0,
    room: 0,
    keys: [],
    x: 200,
    y: 7832,
    width: 105,
    height: 155,
    direction: 'right',
    speed: 0,
    maxSpeed: 0,
    acceleration: 0,
    elementID: '_' + elementID,
    element: 'img',
    src: 'images/characters/man.png'
  }
  return character
}

function incrementDistrictCharacterCount() {
  for (var districtID in districts) {
    var district = districts[districtID]
    if (district.characterCount < 1000) {
      district.characterCount += 1
      return districtID
    }
  }
}

function associatePlayerWithSocket(playerID, socket, districtID) {
  var broadcast = broadcasts[districtID]
  broadcast[playerID] = socket
}

function broadcastCharacterToDistrict(character, districtID) {
  var broadcast = broadcasts[districtID]
  for (var playerID in broadcast) {
    var socket = broadcast[playerID]
    socket.emit('character', character)
  }
}

/* Use for persistent online world:
function getPlayerByToken(token) {
  for (var playerID in players) {
    var player = players[playerID]
    if (player.token === token) {
      return player
    }
  }
}
*/

function refresh() {
  loopThrough(players, updatePlayerCharacter)
  loopThrough(districts['1'].characters, updateLocation)
  loopThrough(districts['1'].vehicles, updateVehicleLocation)
  broadcast()
}

function loopThrough(objects, callback) {
  for (var property in objects) {
    var object = objects[property]
    callback(object)
  }
}

function updatePlayerCharacter(player) {
  var input = player.input
  var characterID = player.character
  var character = districts['1'].characters[characterID]
  if (input.right === true) {
    character.direction = 'right'
    character.speed = 13
  }
  else if (input.left === true) {
    character.direction = 'left'
    character.speed = 13
  }
  else character.speed = 0
}

function updateLocation(object) {
  if (object.speed > 0) {
    if (object.direction === 'left') {
      object.x -= object.speed
      var nextX = object.x - object.speed
    }
    if (object.direction === 'right') {
      object.x += object.speed
      nextX = object.x + object.speed
    }
    var min = 0
    var max = districts['1'].width - object.width
    if (nextX < min) {
      object.direction = 'right'
    }
    if (nextX > max) {
      object.direction = 'left'
    }
  }
}

function updateVehicleLocation(vehicle) {
  if (vehicle.speed > 0) {
    if (vehicle.direction === 'left') {
      vehicle.x -= vehicle.speed
      var nextX = vehicle.x - vehicle.speed
    }
    else if (vehicle.direction === 'right') {
      vehicle.x += vehicle.speed
      nextX = vehicle.x + vehicle.speed
    }
    var min = 0
    var max = districts['1'].width - vehicle.width
    if (nextX < min) {
      vehicle.direction = 'right'
    }
    if (nextX > max) {
      vehicle.direction = 'left'
    }
  }
}

function broadcast() {
  for (var districtID in broadcasts) {
    var broadcast = broadcasts[districtID]
    for (var playerID in broadcast) {
      var socket = broadcast[playerID]
      var district = districts[districtID]
      district.tick = tick
      var timestamp = getTimestamp()
      district.timestamp = timestamp
      socket.emit('district', district)
    }
  }
}

function getTimestamp() {
  var timestamp = Date.now()
  return timestamp
}

function getPlayerIDBySocket(socket) {
  for (var broadcastID in broadcasts) {
    var broadcast = broadcasts[broadcastID]
    for (var playerID in broadcast) {
      var playerSocket = broadcast[playerID]
      if (playerSocket === socket) {
        return playerID
      }
    }
  }
}

function updatePlayerLatency(playerID, timestamp) {
  var newTimestamp = getTimestamp()
  var latency = (newTimestamp - timestamp) / 2
  var player = players[playerID]
  var latencies = player.latencies
  latencies.push(latency)
  if (latencies.length >= 20) {
    latencies.shift()
  }
}

io.on('connection', socket => {
  initiatePlayer(socket)

  /* Use for persistent online world:
  socket.emit('request-token')

  socket.on('token', token => {
    var player = getPlayerByToken(token)
    associatePlayerWithSocket(player, socket)
  })
  */

  socket.on('timestamp', timestamp => {
    var playerID = getPlayerIDBySocket(socket)
    updatePlayerLatency(playerID, timestamp)
  })

  socket.on('input', input => {
    var playerID = getPlayerIDBySocket(socket)
    players[playerID].input = input
    // checkForMissedEvents(playerID)
  })
})

populateDistrict('1')
assignElementIDs(districts)
compose('backgrounds')
compose('foregrounds')

app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => {
  console.log('Listening on port 3000.')
})

setInterval(refresh, 33)
