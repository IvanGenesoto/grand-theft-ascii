var express = require('express')
var app = express()
var http = require('http')
var server = http.Server(app)
var socket = require('socket.io')
var io = socket(server)
var path = require('path')

app.use(express.static(path.join(__dirname, 'public')))

var layerY

var id = {
  player: 0,
  element: 0
}

var broadcasts = {
  '1': {}
}

var players = {}

var districts = {
  '1': {
    timestamp: 0,
    tick: 1,
    id: 1,
    name: 'District 1',
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
    vehicles: {
      '1': {
        id: 1,
        key: '',
        x: 450,
        y: 7852,
        width: 268,
        height: 80,
        direction: 'east',
        speed: 0,
        maxSpeed: 0,
        acceleration: 0,
        deceleration: 0,
        armor: undefined,
        weight: 0,
        element: 'img',
        src: 'images/vehicles/delorean.png'
      }
    },
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

function assignElementIDs(object) {
  for (var property in object) {
    if (property === 'element') {
      id.element += 1
      object.elementID = '_' + id.element
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

function createPlayer() {
  id.player += 1
  players[id.player] = {
    id: id.player,
    token: id.player,
    character: id.player,
    district: 1,
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
  return players[id.player]
}

function createCharacter(player) {
  var characterID = player.character
  var districtID = player.district
  var district = districts[districtID]
  var x = Math.floor(Math.random() * district.width)
  id.element += 1
  var elementID = '_' + id.element
  district.characters[characterID] = {
    id: characterID,
    name: '',
    vehicle: 0,
    room: 0,
    keys: [],
    x: x,
    y: 7832,
    width: 105,
    height: 155,
    direction: 'east',
    speed: 0,
    maxSpeed: 0,
    acceleration: 0,
    elementID: elementID,
    element: 'img',
    src: 'images/characters/man.png'
  }
  return district.characters[characterID]
}

function broadcastCharacter(player, character) {
  for (var districtID in broadcasts) {
    var broadcast = broadcasts[districtID]
    for (var playerID in broadcast) {
      var socket = broadcast[playerID]
      socket.emit('character', character)
    }
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

function associatePlayerWithSocket(player, socket) {
  var playerID = player.id
  var districtID = player.district
  var broadcast = broadcasts[districtID]
  broadcast[playerID] = socket
}

function broadcast() {
  for (var districtID in broadcasts) {
    var broadcast = broadcasts[districtID]
    for (var playerID in broadcast) {
      var socket = broadcast[playerID]
      var district = districts[districtID]
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

function getPlayerBySocket(socket) {
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

function loopThrough(objects, callback) {
  for (var property in objects) {
    var object = objects[property]
    callback(object)
  }
}

function updatePlayerInput(id, input) {
  for (var playerID in players) {
    var player = players[playerID]
    if (playerID === id) {
      player.input = input
      return player
    }
  }
}

function updateCharacter(player) {
  var input = player.input
  var characterID = player.character
  var districtID = player.district
  var district = districts[districtID]
  var character = district.characters[characterID]
  if (input.right === true) {
    character.direction = 'right'
    character.speed = 13
  }
  else if (input.left === true) {
    character.direction = 'left'
    character.speed = 13
  }
  else character.speed = 0
  if (character.speed > 0) {
    if (character.direction === 'left') {
      character.x -= character.speed
    }
    if (character.direction === 'right') {
      character.x += character.speed
    }
    var value = character.x
    var min = character.width
    var max = district.width - character.width
    character.x = keepCharacterInDistrict(value, min, max)
  }
}

function keepCharacterInDistrict(value, min, max) {
  if (value < min) return min
  else if (value > max) return max
  else return value
}

io.on('connection', socket => {
  var player = createPlayer()
  associatePlayerWithSocket(player, socket)
  var character = createCharacter(player)
  broadcastCharacter(player, character)
  socket.emit('player', player)

  /* Use for persistent online world:
  socket.emit('request-token')

  socket.on('token', token => {
    var player = getPlayerByToken(token)
    associatePlayerWithSocket(player, socket)
  })
  */

  socket.on('timestamp', timestamp => {
    var playerID = getPlayerBySocket(socket)
    updatePlayerLatency(playerID, timestamp)
  })

  socket.on('input', input => {
    var playerID = getPlayerBySocket(socket)
    var player = updatePlayerInput(playerID, input) // eslint-disable-line no-unused-vars
    // checkForMissedEvents(player)
  })
})

assignElementIDs(districts)
compose('backgrounds')
compose('foregrounds')

app.use(express.static('public'))
var port = process.env.PORT || 3000
server.listen(port, () => {
  console.log('Listening on port 3000.')
})

setInterval(() => {
  loopThrough(players, updateCharacter)
  broadcast()
}, 33)
