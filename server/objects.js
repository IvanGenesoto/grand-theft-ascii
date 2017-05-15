/* globals io */

var now = require('performance-now')

function Objects(_objects = []) {

  var character = {
    id: undefined,
    type: 'character',
    name: 'Fred',
    status: 'alive',
    player: undefined,
    latency: undefined,
    district: undefined,
    driving: null,
    passenging: null,
    vehicleKeys: [],
    vehicleWelcomes: [],
    room: null,
    roomKeys: [],
    roomWelcomes: [],
    x: undefined,
    y: undefined,
    width: 105,
    height: 155,
    depth: 1,
    direction: undefined,
    visible: true,
    speed: undefined,
    maxSpeed: 80,
    acceleration: 0,
    action: null,
    element: 'img',
    elementID: undefined,
    src: 'images/characters/man.png'
  }

  var vehicle = {
    id: undefined,
    type: 'vehicle',
    model: 'delorean',
    status: 'operational',
    district: 1,
    owner: null,
    keyHolders: [],
    welcomes: [],
    seats: 2,
    driver: null,
    passengers: [],
    blacklist: [],
    x: undefined,
    y: undefined,
    width: 268,
    height: 80,
    direction: undefined,
    speed: undefined,
    maxSpeed: 6,
    acceleration: 0,
    deceleration: 0,
    armor: undefined,
    weight: 0,
    element: 'img',
    elementID: undefined,
    src: 'images/vehicles/delorean.png'
  }

  var room = {
    id: undefined,
    name: 'locked',
    status: '',
    owner: null,
    keyHolders: [],
    welcomes: [],
    inhabitants: [],
    blacklist: [],
    capacity: 50,
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

  var standInCharacter = Object.assign({}, character)
  var standInVehicle = Object.assign({}, vehicle)
  var standInRoom = Object.assign({}, room)

  var objects = {

    length: _objects.length,

    create: (objectType, districtID, districts, x, y) => {

      var directions = {
        character: ['left', 'right'],
        vehicle: ['left', 'right', 'up', 'down', 'upLeft', 'upRight', 'downLeft', 'downRight']
      }

      switch (objectType) {
        case 'character': var object = Object.assign({}, character); break
        case 'vehicle': object = Object.assign({}, vehicle); break
        case 'room': object = Object.assign({}, room); break
        default: console.log('Cannot create object without type.')
      }

      object.district = districtID
      object.direction = directions[Math.floor(Math.random() * directions[objectType].length)]
      object.speed = Math.floor(Math.random() * object.maxSpeed)
      var district = districts[districtID]
      object.x = x ? x : Math.round(Math.random() * (district.width - object.width)) // eslint-disable-line
      if (character.type === 'character') object.y = 7832
      else object.y = y ? y : Math.round(Math.random() * (district.height - object.height)) // eslint-disable-line

      _objects.push(object)
      object.id = _objects.length
      object.elementID = 'o' + object.id

      objects[object.id] = objects.get(object.id)
      objects.length = objects.getLength()

      return object.id
    },

    get: id => {
      var object = _objects[id - 1]
      switch (object.type) {
        case 'character': var standIn = standInCharacter; break
        case 'vehicle': standIn = standInVehicle; break
        case 'room': standIn = standInRoom; break
        default: console.log('Cannot get object without type.')
      }
      for (var property in object) {
        var value = object[property]
        if (typeof value !== 'object' || value === null) standIn[property] = value
        else if (Array.isArray(value)) {
          standIn[property].length = 0
          value.forEach((item, index) => {
            standIn[property][index] = item
          })
        }
        else {
          standIn[property] = 'Object found in object ' + id + '.'
        }
      }
      return standIn
    },

    getLength: () => _objects.length,

    assignPlayer: (characterID, playerID) => {
      _objects[characterID - 1].player = playerID
    },

    assignDistrict: (characterID, districtID) => {
      _objects[characterID - 1].district = districtID
    },

    own: (characterID, objectID) => {
      var character = _objects[characterID - 1]
      var object = _objects[objectID - 1]
      switch (object.type) {
        case 'vehicle': var keys = 'vehicleKeys'; break
        case 'room': keys = 'roomKeys'; break
        default: console.log('Character cannot own object without type.')
      }
      object.owner = characterID
      character[keys].push(objectID)
    },

    updatePlayerCharactersBehavior: (characterIDs, players) => {
      var active = {}
      characterIDs.forEach(characterID => {
        var character = _objects[characterID - 1]
        var player = players[character.player]
        var input = player.input
        if (input.right) {
          character.direction = 'right'
          character.speed = 5
        }
        else if (input.left) {
          character.direction = 'left'
          character.speed = 5
        }
        else character.speed = 0
        character.action = input.action
        if (character.action) {
          if (!active) active = {}
          if (character.driving) {
            if (!active.drivers) active.drivers = []
            var vehicle = _objects[character.driving - 1]
            active.drivers.push(vehicle.id)
          }
          else if (character.passenging) {
            if (!active.passengers) active.passengers = []
            active.passengers.push(character.id)
          }
          else {
            if (!active.walkers) active.walkers = []
            active.walkers.push(character.id)
          }
        }
      })
      return active
    },

    updateLocations: (districts) => {
      _objects.forEach(object => {
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
          if (object.type === 'character') {
            if (nextX < min) {
              object.x = min
            }
            if (nextX > max) {
              object.x = max
            }
          }
          else {
            if (nextX < min) {
              object.direction = 'right'
            }
            if (nextX > max) {
              object.direction = 'left'
            }
          }
        }
      })
    },

    updateLatencies: (latencies) => {
      var characterID = null
      var latency = null
      latencies.forEach((item, index) => {
        if (!(index % 2) || index === 0) characterID = item
        else latency = item
        if (characterID && latency) {
          _objects[characterID - 1].latency = latency
          characterID = null
          latency = null
        }
      })
    },

    emit: (io) => {
      _objects[0].timestamp = now()
      io.volatile.emit('objects', _objects)
    }
  }

  return objects
}

module.exports = Objects
