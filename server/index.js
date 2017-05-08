var express = require('express')
var app = express()
var http = require('http')
var server_ = http.Server(app)
var socket = require('socket.io')
var io = socket(server_)
var path = require('path')
var port = process.env.PORT || 3000
var now = require('performance-now')

var server = {
  layerY: 0,
  timestamp: 0,
  timeoutID: 0,
  tick: 0,
  setDelay: {
    millisecondsAhead: 0,
    totalStartTime: 0,
    refreshStartTime: 0
  }
}

var id = {
  vehicle: 0,
  key: 0,
  element: 0,
  player: 0,
  character: 0,
  queue: 0
}

var players = {}

var districts = {
  '1': {
    timestamp: 0,
    tick: 0,
    id: 1,
    name: 'District 1',
    width: 32000,
    height: 8000,
    population: {
      characters: 0,
      aiCharacters: 0,
      vehicles: 0
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
      }
    }
  }
}

var queuedDistricts = {}

function populateDistricts(districtID) {
  populateWithAICharacters(districtID)
  populateWithVehicles(districtID)
}

function populateWithAICharacters(districtID) {
  var district = districts[districtID]
  while (district.population.aiCharacters < 200) {
    district.population.aiCharacters += 1
    var aiCharacter = createAICharacter(districtID)
    district.aiCharacters[aiCharacter.id] = aiCharacter
  }
}

function createAICharacter(districtID) {
  var directions = ['left', 'right']
  var directionIndex = Math.floor(Math.random() * directions.length)
  var aiCharacter = {
    id: id.character += 1,
    name: '',
    room: 0,
    keys: [],
    y: 7832,
    width: 105,
    height: 155,
    direction: directions[directionIndex],
    speed: Math.floor(Math.random() * 6),
    maxSpeed: 0,
    acceleration: 0,
    element: 'img',
    src: 'images/characters/man.png'
  }
  aiCharacter.x = Math.floor(Math.random() * (districts[districtID].width - aiCharacter.width))
  return aiCharacter
}

function populateWithVehicles(districtID) {
  var district = districts[districtID]
  if (district.population.vehicles < 500) {
    district.population.vehicles += 1
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
    speed: Math.floor(Math.random() * 76),
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

function composeScenery(type) {
  for (var districtID in districts) {
    var district = districts[districtID]
    for (var sceneryType in district.scenery) {
      if (sceneryType === type) {
        var layers = district.scenery[sceneryType]
        server.layerY = 0
        for (var layerID in layers) {
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
            createBlueprints(type, layer, section, rows, variationsArray)
          }
        }
      }
    }
  }
}

function createBlueprints(type, layer, section, rows, variationsArray) {
  var rowsDrawn = 0
  function startRow() {
    var x = 0
    var rowY = 0
    function createBlueprint() {
      if (x < layer.width) {
        var index = Math.floor(Math.random() * variationsArray.length)
        var variation = variationsArray[index]
        if (layer.y) server.layerY = layer.y
        var blueprint = {section: section.id, variation: variation.id, x, y: server.layerY}
        layer.blueprints.push(blueprint)
        if (type === 'foregrounds') {
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
        server.layerY += rowY
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
  var districtID = getDistrictID()
  player.character = character.id
  player.district = districtID
  character.district = districtID
  players[player.id] = player
  socket.emit('player', player)
  player.socket = socket
  socket.join(districtID.toString())
  districts[districtID].characters[character.id] = character
  broadcastCharacterToDistrict(character, districtID)
}

function createPlayer() {
  var player = {
    id: id.player += 1,
    latencyBuffer: [],
    inputBuffer: [],
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

function getDistrictID() {
  for (var districtID in districts) {
    var district = districts[districtID]
    if (district.population.characters < 500) {
      district.population.characters += 1
      return districtID
    }
  }
}

// function associatePlayerWithSocket(playerID, socket, districtID) {
//   var broadcast = broadcasts[districtID]
//   broadcast[playerID] = socket
// }

function broadcastCharacterToDistrict(character, districtID) {
  io.to(districtID.toString()).emit('character', character)
}

// function broadcastCharacterToDistrict(character, districtID) {
//   var broadcast = broadcasts[districtID]
//   for (var playerID in broadcast) {
//     var socket = broadcast[playerID]
//     socket.emit('character', character)
//   }
// }

function getPlayerIDBySocket(socket) {
  for (var playerID in players) {
    if (players[playerID].socket === socket) {
      return playerID
    }
  }
}

// function getPlayerIDBySocket(socket) {
//   for (var broadcastID in broadcasts) {
//     var broadcast = broadcasts[broadcastID]
//     for (var playerID in broadcast) {
//       var playerSocket = broadcast[playerID]
//       if (playerSocket === socket) {
//         return playerID
//       }
//     }
//   }
// }

// function removePlayerFromBroadcast(playerID) {
//   var districtID = players[playerID].district
//   var broadcast = broadcasts[districtID]
//   delete broadcast[playerID]
// }

function updatePlayerLatencyBuffer(playerID, timestamp) {
  var newTimestamp = now()
  var latency = (newTimestamp - timestamp) / 2
  var player = players[playerID]
  var districtID = player.district
  var district = districts[districtID]
  var latencyBuffer = players[playerID].latencyBuffer
  latencyBuffer.push(latency)
  if (latencyBuffer.length >= 20) {
    latencyBuffer.shift()
  }
  district.latencyBuffer = latencyBuffer
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
  server.setDelay.refreshStartTime = now()
  server.tick += 1
  updatePlayerCharactersSpeedDirection()
  updateLocation('characters')
  updateLocation('aiCharacters')
  updateLocation('vehicles')
  if (!(server.tick % 3)) {
    broadcast()
  }
  setDelay()
}

function updatePlayerCharactersSpeedDirection() {
  for (var playerID in players) {
    var player = players[playerID]
    var input = player.input
    var characterID = player.character
    var districtID = player.district
    var character = districts[districtID].characters[characterID]
    if (input.right === true) {
      character.direction = 'right'
      character.speed = 5
    }
    else if (input.left === true) {
      character.direction = 'left'
      character.speed = 5
    }
    else character.speed = 0
  }
}

function updateLocation(type) {
  for (var districtID in districts) {
    var district = districts[districtID]
    var objects = district[type]
    for (var objectID in objects) {
      var object = objects[objectID]
      if (object.speed > 0) {
        if (object.direction === 'left') {
          object.x -= object.speed
          var nextX = object.x - object.speed
        }
        else if (object.direction === 'right') {
          object.x += object.speed
          nextX = object.x + object.speed
        }
        var min = 0
        var max = districts[1].width - object.width
        if (nextX < min) {
          object.direction = 'right'
        }
        if (nextX > max) {
          object.direction = 'left'
        }
      }
    }
  }
}

function broadcast() {
  for (var districtID in districts) {
    var district = districts[districtID]
    district.tick = server.tick
    district.timestamp = now()
    // id.queue += 1
    // var queuedDistrict = queuedDistricts[id.queue]
    // queuedDistrict = {...district}
    // setTimeout(() => {
    io.to(districtID.toString()).volatile.emit('district', district)
    // // // }, 3000)
  }
}

// function broadcast() {
//   for (var districtID in broadcasts) {
//     var broadcast = broadcasts[districtID]
//     for (var playerID in broadcast) {
//       var socket = broadcast[playerID]
//       var district = districts[districtID]
//       district.tick = server.tick
//       var timestamp = now()
//       district.timestamp = timestamp
//       socket.volatile.emit('district', district)
//     }
//   }
// }

function setDelay() {
  var _ = server.setDelay
  var refreshDuration = now() - _.refreshStartTime
  var totalDuration = now() - _.totalStartTime
  _.totalStartTime = now()
  var delayDuration = totalDuration - refreshDuration
  if (_.checkForSlowdown) {
    if (delayDuration > _.delay * 1.2) {
      _.slowdownCompensation = _.delay / delayDuration
      _.slowdownConfirmed = true
    }
  }
  _.millisecondsAhead += 1000 / 60 - totalDuration
  _.delay = 1000 / 60 + _.millisecondsAhead - refreshDuration
  clearTimeout(_.timeoutID)
  if (_.delay < 5) {
    _.checkForSlowdown = false
    refresh()
  }
  else {
    if (_.slowdownConfirmed) {
      _.delay = _.delay * _.slowdownCompensation
      if (_.delay < 14) {
        if (_.delay < 7) {
          refresh()
        }
        else {
          _.checkForSlowdown = true
          _.slowdownConfirmed = false
          _.timeoutID = setTimeout(refresh, 0)
        }
      }
      else {
        _.checkForSlowdown = true
        _.slowdownConfirmed = false
        var delay = Math.round(_.delay)
        _.timeoutID = setTimeout(refresh, delay - 2)
      }
    }
    else {
      _.checkForSlowdown = true
      delay = Math.round(_.delay - 2)
      _.timeoutID = setTimeout(refresh, delay)
    }
  }
}

function getAverage(value, bufferName, maxItems = 60, precision = 1000) {
  if (!server.getAverage) server.getAverage = {}
  var _ = server.getAverage
  if (!_[bufferName]) _[bufferName] = []
  _[bufferName].push(value)
  if (_[bufferName].length > maxItems) _[bufferName].shift()
  var total = _[bufferName].reduce((total, value) => {
    return total + value
  }, 0)
  var average = total / _[bufferName].length
  return Math.round(average * precision) / precision
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

  // socket.on('disconnect', socket => {
  //   var playerID = getPlayerIDBySocket(socket)
  //   removePlayerFromBroadcast(playerID)
  // })

  socket.on('timestamp', timestamp => {
    var playerID = getPlayerIDBySocket(socket)
    updatePlayerLatencyBuffer(playerID, timestamp)
  })

  socket.on('input', input => {
    var playerID = getPlayerIDBySocket(socket)
    players[playerID].input = input
    // checkForMissedEvents(playerID)
  })
})

populateDistricts(1)
assignElementIDs(districts)
composeScenery('backgrounds')
composeScenery('foregrounds')

app.use(express.static(path.join(__dirname, 'public')))
server_.listen(port, () => {
  console.log('Listening on port 3000.')
})

server.setDelay.totalStartTime = now() - 1000 / 60
refresh()
