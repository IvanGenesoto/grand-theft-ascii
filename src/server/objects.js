/* eslint-disable no-fallthrough */

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
    room: null,
    vehicles: [],
    vehicleKeys: [],
    vehicleWelcomes: [],
    rooms: [],
    roomKeys: [],
    roomWelcomes: [],
    x: undefined,
    y: undefined,
    width: 105,
    height: 155,
    depth: 1,
    direction: undefined,
    speed: undefined,
    maxSpeed: 6,
    acceleration: 2,
    deceleration: 5,
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
    seats: 2,
    driver: null,
    keyHolders: [],
    welcomes: [],
    passengers: [],
    x: undefined,
    y: undefined,
    width: 268,
    height: 80,
    direction: undefined,
    speed: undefined,
    maxSpeed: 80,
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
    capacity: 50,
    occupants: [],
    keyHolders: [],
    welcomes: [],
    unwelcomes: [],
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

  var standInCharacter = {
    vehicles: [],
    vehicleKeys: [],
    vehicleWelcomes: [],
    rooms: [],
    roomKeys: [],
    roomWelcomes: []
  }
  var standInVehicle = {
    keyHolders: [],
    passengers: [],
    welcomes: []
  }
  var standInRoom = {
    keyHolders: [],
    inhabitants: [],
    welcomes: [],
    unwelcomes: []
  }

  var objects = {

    length: _objects.length,

    create: (objectType, districtID, districts, x, y, speed) => {

      var directions = {
        character: ['left', 'right'],
        vehicle: ['left', 'right', 'up', 'down', 'up-left', 'up-right', 'down-left', 'down-right']
      }

      switch (objectType) {
        case 'character':
          var object = {
            ...character,
            vehicles: [],
            vehicleKeys: [],
            vehicleWelcomes: [],
            rooms: [],
            roomKeys: [],
            roomWelcomes: []
          }
          break
        case 'vehicle':
          object = {
            ...vehicle,
            keyHolders: [],
            welcomes: [],
            passengers: []
          }
          break
        case 'room':
          object = {
            ...room,
            occupants: [],
            keyHolders: [],
            welcomes: [],
            unwelcomes: [],
            scenery: {
              background: undefined,
              foreground: undefined
            }
          }
          break
        default: console.log('Cannot create object without type.')
      }

      object.district = districtID
      object.direction = directions[objectType][Math.floor(Math.random() * directions[objectType].length)]
      if (speed || speed === 0) object.speed = speed
      object.speed = (speed || speed === 0) ? speed : Math.round(Math.random() * object.maxSpeed)
      var district = districts[districtID]
      object.x = x ? x : Math.random() * (district.width - object.width) // eslint-disable-line no-unneeded-ternary
      if (object.type === 'character') object.y = district.height - 168
      else if (object.type === 'vehicle') object.y = y ? y : Math.random() * (district.height - object.height - 77) // eslint-disable-line no-unneeded-ternary

      object.id = _objects.length
      object.elementID = 'o' + object.id
      _objects.push(object)

      objects[object.id] = objects.get(object.id)
      objects.length = objects.getLength()

      return object.id
    },

    get: id => {
      var object = _objects[id]
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

    refresh: () => {
      var id = 0
      while (id < _objects.length) {
        objects[id] = objects.get(id)
        id++
      }
    },

    getLength: () => _objects.length,

    assignPlayer: (characterID, playerID) => {
      _objects[characterID].player = playerID
    },

    assignDistrict: (characterID, districtID) => {
      _objects[characterID].district = districtID
    },

    makeOwner: (characterID, objectID) => {
      var object = _objects[objectID]
      if (object.type === 'vehicle' || object.type === 'room') {
        object.owner = characterID
      }
    },

    giveKey: (characterID, objectID) => {
      var character = _objects[characterID]
      var object = _objects[objectID]
      if (object.type === 'vehicle') var keys = 'vehicleKeys'
      else keys = 'roomKeys'
      character[keys].push(objectID)
    },

    updatePlayerCharactersBehavior: (playerCharacterIDs, players) => {
      var active = {}
      playerCharacterIDs.forEach(characterID => {
        var character = _objects[characterID]
        var player = players[character.player]
        var input = player.input
        if (character.driving) var driver = objects.drive(characterID, input)
        else {
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
            else if (character.passenging) {
              if (!active.passengers) active.passengers = []
              active.passengers.push(character.id)
            }
            else {
              if (!active.walkers) active.walkers = []
              active.walkers.push(character.id)
            }
          }
        }
        if (driver) {
          if (!active.drivers) active.drivers = []
          active.drivers.push(driver)
        }
      })
      return active
    },

    putCharactersInVehicles: (characterIDs, vehicleIDs) => {
      characterIDs.forEach((characterID, index) => {
        var character = _objects[characterID]
        var vehicleID = vehicleIDs[index]
        var vehicle = _objects[vehicleID]
        if (!vehicle.driver) {
          character.driving = vehicleID
          vehicle.driver = characterID
        }
        else if (vehicle.passengers < vehicle.seats - 1) {
          character.passenging = vehicle.id
          vehicle.passengers.push(characterID)
        }
      })
    },

    drive: (characterID, input) => {
      var character = _objects[characterID]
      var vehicleID = character.driving
      var vehicle = _objects[vehicleID]
      var {up, down, left, right, action, accelerate, decelerate} = input
      switch (true) {
        case right: vehicle.direction = 'right'
        case up && right : vehicle.direction = 'up-right'
        case down && right : vehicle.direction = 'down-right'; break
        case left: vehicle.direction = 'left'
        case up && left: vehicle.direction = 'up-left'
        case down && left: vehicle.direction = 'down-left'; break
        case up: vehicle.direction = 'up'; break
        case down: vehicle.direction = 'down'; break
        default: vehicle.direction = 'right'
      }
      if (accelerate) vehicle.speed += vehicle.acceleration / 100
      if (decelerate) vehicle.speed -= vehicle.deceleration / 100
      if (vehicle.speed > vehicle.maxSpeed) vehicle.speed = vehicle.maxSpeed
      if (vehicle.speed < 0) vehicle.speed = 0
      if (action) {
        return characterID
      }
    },

    updateLocations: (districts) => {
      _objects.forEach(object => {
        if (object.type === 'vehicle') objects.updateVehicleLocation(object, districts)
        else if (object.type === 'character') objects.updateCharacterLocation(object, districts)
      })
    },

    updateCharacterLocation: (character, districts) => {
      var {speed, direction, district, width} = character
      if (speed > 0) {
        if (direction === 'left') {
          character.x -= speed
          var nextX = character.x - speed
        }
        else if (direction === 'right') {
          character.x += speed
          nextX = character.x + speed
        }
        var min = 0
        var max = districts[district].width - width
        if (character.player) {
          if (nextX < min) {
            character.x = min
          }
          if (nextX > max) {
            character.x = max
          }
        }
        else {
          if (nextX < min) {
            character.direction = 'right'
          }
          if (nextX > max) {
            character.direction = 'left'
          }
        }
      }
    },

    updateVehicleLocation: (vehicle, districts) => {
      var {speed, direction, district, width, height, driver} = vehicle
      var distance = Math.pow((speed / 2), 2)
      switch (direction) {
        case 'up':
          vehicle.y -= speed
          var nextY = vehicle.y - speed
          break
        case 'down':
          vehicle.y += speed
          nextY = vehicle.y + speed
          break
        case 'left':
          vehicle.x -= speed
          var nextX = vehicle.x - speed
          break
        case 'right':
          vehicle.x += speed
          nextX = vehicle.x + speed
          break
        case 'up-right':
          vehicle.y -= distance
          vehicle.x += distance
          nextY = vehicle.y - distance
          nextX = vehicle.x + distance
          break
        case 'down-right':
          vehicle.y += distance
          vehicle.x += distance
          nextY = vehicle.y + distance
          nextX = vehicle.x + distance
          break
        case 'up-left':
          vehicle.y -= distance
          vehicle.x -= distance
          nextY = vehicle.y - distance
          nextX = vehicle.x - distance
          break
        case 'down-left':
          vehicle.y += distance
          vehicle.x -= distance
          nextY = vehicle.y + distance
          nextX = vehicle.x - distance
          break
        default:
      }
      var min = 0
      var maxX = districts[district].width - width
      var maxY = districts[district].height - height
      if (driver) {
        var character = objects[character.id]
        if (character.player) {
          if (nextX < min) {
            vehicle.x = min
            vehicle.speed = 0
          }
          if (nextX > maxX) {
            vehicle.x = maxX
            vehicle.speed = 0
          }
          if (nextY < min) {
            vehicle.y = min
            vehicle.speed = 0
          }
          if (nextY > maxY) {
            vehicle.y = maxY
            vehicle.speed = 0
          }
        }
        else {
          var directions = ['left', 'right', 'up', 'down', 'up-left', 'up-right', 'down-left', 'down-right']
          if (nextX < min || nextX > maxX || nextY < min || nextY > maxY) {
            vehicle.direction = directions[Math.floor(Math.random() * directions.length)]
          }
        }
      }
    },

    updateLatencies: (latencies) => {
      var characterID = null
      var latency = null
      latencies.forEach((item, index) => {
        if (!(index % 2) || index === 0) characterID = item
        else latency = item
        if (characterID && latency) {
          _objects[characterID].latency = latency
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
