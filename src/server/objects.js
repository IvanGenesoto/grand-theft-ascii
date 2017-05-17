/* eslint-disable no-fallthrough */

var now = require('performance-now')

function Objects(_objects = []) {

  const all = []

  const multiple = []

  const putted = {
    charactersPutInVehicles: [],
    vehiclesCharactersWerePutIn: [],
    strandedWalkers: []
  }

  function createObject(type) {

    const characterPrototype = {
      id: undefined,
      type: 'character',
      name: 'Fred',
      status: 'alive',
      player: undefined,
      latency: undefined,
      district: undefined,
      driving: null,
      passenging: null,
      occupying: null,
      vehicleMasterKeys: [],
      vehicleKeys: [],
      vehicleWelcomes: [],
      roomMasterKeys: [],
      roomKeys: [],
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
      action: false,
      element: 'img',
      elementID: undefined,
      src: 'images/characters/man.png'
    }

    const vehiclePrototype = {
      id: undefined,
      type: 'vehicle',
      model: 'delorean',
      status: 'operational',
      district: undefined,
      seats: 2,
      driver: null,
      masterKeyHolders: [],
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

    const roomPrototype = {
      id: undefined,
      type: 'room',
      name: 'Pad',
      status: 'locked',
      district: undefined,
      capacity: 50,
      occupants: [],
      masterKeyHolders: [],
      keyHolders: [],
      unwelcomes: [],
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      element: 'canvas',
      background: undefined,
      foreground: undefined,
      inventory: undefined,
      scenery: {
        background: undefined,
        foreground: undefined
      }
    }

    switch (type) {
      case 'character': var objectPrototype = characterPrototype; break
      case 'vehicle': objectPrototype = vehiclePrototype; break
      case 'room': objectPrototype = roomPrototype; break
      default:
    }

    var object = {...objectPrototype}

    for (var property in objectPrototype) {
      var value = objectPrototype[property]
      if (Array.isArray(value)) object[property] = [...value]
      else if (typeof value === 'object' && value !== null) {
        for (var nestedProperty in value) {
          var nestedValue = value[nestedProperty]
          object[property][nestedProperty] = {...nestedValue}
        }
      }
    }

    return object
  }

  const objects = {

    length: _objects.length,

    create: (type, districtID, x, y, speed, districtWidth = 3200, districtHeight = 8000) => {
      const directions = {
        character: ['left', 'right'],
        vehicle: ['left', 'right', 'up', 'down', 'up-left', 'up-right', 'down-left', 'down-right']
      }

      const object = createObject(type)
      const objectClone = createObject(type)

      object.district = districtID

      if (type !== 'room') {
        object.direction = directions[type][Math.floor(Math.random() * directions[type].length)]
        object.speed = (speed || speed === 0) ? speed : Math.round(Math.random() * object.maxSpeed)
        object.x = x ? x : Math.random() * (districtWidth - object.width) // eslint-disable-line no-unneeded-ternary
      }
      if (type === 'character') object.y = districtHeight - 168
      else if (object.type === 'vehicle') object.y = y ? y : Math.random() * (districtHeight - object.height - 77) // eslint-disable-line no-unneeded-ternary

      object.id = _objects.length
      object.elementID = 'o' + object.id
      _objects.push(object)

      const id = object.id
      objects[id] = objectClone
      objects.clone(id)
      objects.refreshLength()

      return id
    },

    clone: id => {
      const objectClone = objects[id]
      const object = _objects[id]

      Object.assign = (objectClone, object)
      for (var property in object) {
        var value = object[property]
        if (Array.isArray(value)) {
          objectClone[property].length = 0
          objectClone[property] = [...value]
        }
        else if (typeof value === 'object' && value !== null) {
          for (var nestedProperty in value) {
            var nestedValue = value[nestedProperty]
            object[property][nestedProperty] = {...nestedValue}
          }
        }
      }

      objects[id] = objectClone
      return objectClone
    },

    cloneMultiple: (...idArrays) => {
      multiple.length = 0
      idArrays.forEach(idArray => {
        idArray.forEach((id) => {
          var objectClone = objects.clone(id)
          multiple.push(objectClone)
        })
      })
      return multiple
    },

    cloneAll: () => {
      all.length = 0
      _objects.forEach((item, id) => {
        var object = objects.clone(id)
        all.push(object)
      })
    },

    refreshLength: () => {
      objects.length = _objects.length
    },

    assignPlayer: (characterID, playerID) => {
      _objects[characterID].player = playerID
      objects[characterID].player = playerID
    },

    assignDistrict: (objectID, districtID) => {
      _objects[objectID].district = districtID
      objects[objectID].district = districtID
    },

    giveKey: (characterID, objectID, masterKey) => {
      var character = _objects[characterID]
      var object = _objects[objectID]
      var type = object.type

      switch (true) {
        case type === 'vehicle': var keysType = 'vehicleKeys'
        case type === 'vehicle' && masterKey: keysType = 'vehicleMasterKeys'; break
        case type === 'room': keysType = 'roomKeys'
        case type === 'room' && masterKey: keysType = 'roomMasterKeys'; break
        default:
      }

      var keys = character[keysType]
      var duplicateKey = keys.find(key => key === objectID)
      if (!duplicateKey) keys.push(objectID)
      if (masterKey) var keyHoldersType = 'masterKeyHolders'
      else keyHoldersType = 'keyHolders'
      var keyHolders = object[keyHoldersType]
      var duplicateKeyHolder = keyHolders.find(keyHolder => keyHolder === characterID)
      if (!duplicateKeyHolder) keyHolders.push(characterID)
      if (masterKey) objects.giveKey(characterID, objectID)
    },

    putCharactersInVehicles: (characterIDs, vehicleIDs) => {
      console.log('putCharactersInVehicles');
      var {charactersPutInVehicles, vehiclesCharactersWerePutIn, strandedWalkers} = putted
      charactersPutInVehicles.length = 0
      vehiclesCharactersWerePutIn.length = 0
      strandedWalkers.length = 0
      characterIDs.forEach((characterID, index) => {

        var character = _objects[characterID]
        var vehicleID = vehicleIDs[index]
        var vehicle = _objects[vehicleID]
        var {driver, passengers, seats} = vehicle
        if (driver) {
          driver = 1

          if (driver + passengers.length < seats) {
            character.passenging = vehicleID
            vehicle.passengers.push(characterID)
            charactersPutInVehicles.push(characterID)
            vehiclesCharactersWerePutIn.push(vehicleID)
          }
          else strandedWalkers.push(characterID)
        }
        else {
          character.driving = vehicleID
          vehicle.driver = characterID
        }
      })
      return putted
    },

    walk: (playerCharacterIDs, players) => {
      playerCharacterIDs.forEach(characterID => {
        var character = _objects[characterID]
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
        var {driving, passenging, occupying, type} = object
        if (driving || passenging) objects.updateTravelingCharacterLocation(object)
        else if (occupying) objects.updateOccupyingCharacterLocation(object, districts)
        else if (type === 'character') objects.updateWalkingCharacterLocation(object, districts)
        else if (type === 'vehicle') objects.updateVehicleLocation(object, districts)
      })
    },

    updateTravelingCharacterLocation: (object) => {
      var {driving, passenging} = object
      var vehicle = driving ? _objects[driving] : _objects[passenging]
      var {x, y, width, height} = vehicle
      object.x = x + width / 2
      object.y = y + height / 2
    },

    updateOccupyingCharacterLocation: (object, districts) => {
    },

    updateWalkingCharacterLocation: (character, districts) => {
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
          var directions = ['left', 'right', 'down', 'down-left', 'down-right', 'down-left', 'down-right']
          break
        case 'down':
          vehicle.y += speed
          nextY = vehicle.y + speed
          directions = ['left', 'right', 'up', 'up-left', 'up-right', 'up-left', 'up-right']
          break
        case 'left':
          vehicle.x -= speed
          var nextX = vehicle.x - speed
          directions = ['up', 'down', 'right', 'up-right', 'down-right', 'right', 'up-right', 'down-right']
          break
        case 'right':
          vehicle.x += speed
          nextX = vehicle.x + speed
          directions = ['up', 'down', 'up-left', 'down-left', 'left', 'up-left', 'down-left', 'left']
          break
        case 'up-right':
          vehicle.y -= distance
          vehicle.x += distance
          nextY = vehicle.y - distance
          nextX = vehicle.x + distance
          directions = ['left', 'up-left', 'down-left', 'down-right']
          break
        case 'down-right':
          vehicle.y += distance
          vehicle.x += distance
          nextY = vehicle.y + distance
          nextX = vehicle.x + distance
          directions = ['left', 'up-left', 'up-right', 'down-left']
          break
        case 'up-left':
          vehicle.y -= distance
          vehicle.x -= distance
          nextY = vehicle.y - distance
          nextX = vehicle.x - distance
          directions = ['right', 'up-right', 'down-left', 'down-right']
          break
        case 'down-left':
          vehicle.y += distance
          vehicle.x -= distance
          nextY = vehicle.y + distance
          nextX = vehicle.x - distance
          directions = ['right', 'up-left', 'up-right', 'down-right']
          break
        default:
      }

      var min = 0
      var maxX = districts[district].width - width
      var maxY = districts[district].height - height - 77
      if (driver) var character = _objects[driver]
      if (driver && character.player) {
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
        if (nextX < min || nextX > maxX || nextY < min || nextY > maxY) {
          vehicle.direction = directions[Math.floor(Math.random() * directions.length)]
          switch (true) {
            case nextX < min:
              vehicle.x = min
              break
            case nextX > maxX:
              vehicle.x = maxX; break
            case nextY < min:
              vehicle.y = min
              break
            case nextY > maxY:
              vehicle.y = maxY
              break
            default:
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
