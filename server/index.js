var express = require('express')
var app = express()
var http = require('http')
var server = http.Server(app)
var socket = require('socket.io')
var io = socket(server)
var path = require('path')
var port = process.env.PORT || 3000
var now = require('performance-now')

var _ = {
  tick: 0,
  id: {
    character: 0,
    vehicle: 0,
    element: 0,
    player: 0,
    key: 0
  }
}

var players = {}

var districtsBuffer = [null, null, null, null, null, null]

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
    id: _.id.character += 1,
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
    id: _.id.vehicle += 1,
    key: _.id.key += 1,
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
      var element = {id: _.id.element += 1}
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
        _.layerY = 0
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
        if (layer.y) _.layerY = layer.y
        var blueprint = {section: section.id, variation: variation.id, x, y: _.layerY}
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
        _.layerY += rowY
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
  character.latencyBuffer = player.latencyBuffer
  players[player.id] = player
  socket.emit('player', player)
  player.socket = socket.id
  socket.join(districtID.toString())
  districts[districtID].characters[character.id] = character
  broadcastCharacterToDistrict(character, districtID)
}

function createPlayer() {
  var player = {
    id: _.id.player += 1,
    characterBuffer: [],
    latencyBuffer: [],
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
  var elementID = _.id.element += 1
  var character = {
    id: _.id.character += 1,
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

function broadcastCharacterToDistrict(character, districtID) {
  io.to(districtID.toString()).emit('character', character)
}

function getPlayerIDBySocketID(socketID) {
  for (var playerID in players) {
    if (players[playerID].socket === socketID) {
      return playerID
    }
  }
}

function updatePlayerLatencyBuffer(playerID, timestamp) {
  var newTimestamp = now()
  var latency = (newTimestamp - timestamp)
  var latencyBuffer = players[playerID].latencyBuffer
  latencyBuffer.push(latency)
  if (latencyBuffer.length >= 20) latencyBuffer.shift()
}

function updatePlayerInputBuffer(playerID) {
  // var player = players[playerID]
  // var latencyBuffer = player.latencyBuffer
  // var total = latencyBuffer.reduce((total, value) => {
  //   return total + value
  // }, 0)
  // var latency = total / latencyBuffer.length
  // var ticksAgo = Math.floor(latency / (1000 / 60))
  // var index = 5 - ticksAgo
  // player.inputBuffer[index] = player.input
}

// function updateReconcilliationBuffer(playerID, index, input) {
//   var player = players[playerID]
//   var districtID = player.district
//   var characterID = player.character
// }

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
  _.refreshStartTime = now()
  _.tick += 1
  updatePlayerCharactersSpeedDirection()
  updateLocation('characters')
  updateLocation('aiCharacters')
  updateLocation('vehicles')
  checkForMissedEvents()
  if (!(_.tick % 3)) broadcast()
  districtsBuffer.push(Object.assign({}, districts))
  districtsBuffer.shift()
  setDelay()
}

function checkForMissedEvents() {

}

// function reconcilePlayerCharactersSpeedDirection() {
//   reconcilliationBuffer.forEach(reconciliation => {
//     var {input, characterID, districtID} = reconciliation
//     var character = districts[districtID].characters[characterID]
//     if (input.right === true) {
//       character.direction = 'right'
//       character.speed = 5
//     }
//     else if (input.left === true) {
//       character.direction = 'left'
//       character.speed = 5
//     }
//     else character.speed = 0
//   })
// }

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

function updateLocation(objectType) {
  for (var districtID in districts) {
    var district = districts[districtID]
    var objects = district[objectType]
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
    district.timestamp = now()
    district.tick = _.tick
    io.to(districtID.toString()).volatile.emit('district', district)
  }
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

// function getAverage(value, bufferName, maxItems = 60, precision = 1000) { // eslint-disable-line no-unused-vars
//   if (!_.getAverage) _.getAverage = {}
//   var __ = _.getAverage
//   if (!__[bufferName]) __[bufferName] = []
//   __[bufferName].push(value)
//   if (__[bufferName].length > maxItems) __[bufferName].shift()
//   var total = __[bufferName].reduce((total, value) => {
//     return total + value
//   }, 0)
//   var average = total / __[bufferName].length
//   return Math.round(average * precision) / precision
// }

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
    var playerID = getPlayerIDBySocketID(socket.id)
    updatePlayerLatencyBuffer(playerID, timestamp)
  })

  socket.on('input', input => {
    var playerID = getPlayerIDBySocketID(socket.id)
    players[playerID].input = input
    updatePlayerInputBuffer(playerID)
    // var index = getReconcilliationIndex(playerID)
    // updateReconcilliationBuffer(playerID, index, input)
  })
})

populateDistricts(1)
assignElementIDs(districts)
composeScenery('backgrounds')
composeScenery('foregrounds')

app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => {
  console.log('Listening on port 3000.')
})

setInterval(() => {
}, 1000)

refresh()
