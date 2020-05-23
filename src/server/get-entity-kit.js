import now from 'performance-now'

export const getEntityKit = function (_entities = []) {

  const all = []
  const multiple = []

  function createCityElement(type) {

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
      active: 0,
      tag: 'img',
      elementId: undefined,
      src: 'images/characters/man.png'
    }

    const vehiclePrototype = {
      id: undefined,
      type: 'vehicle',
      model: 'delorean',
      status: 'operational',
      district: undefined,
      seats: 2,
      driver: 0,
      masterKeyHolders: [],
      keyHolders: [],
      welcomes: [],
      passengers: [],
      x: undefined,
      y: undefined,
      width: 268,
      height: 80,
      direction: undefined,
      previousDirection: undefined,
      speed: undefined,
      maxSpeed: 80,
      slowing: false,
      falling: false,
      acceleration: 4,
      deceleration: 10,
      armor: undefined,
      weight: 0,
      tag: 'img',
      elementId: undefined,
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
      tag: 'canvas',
      background: undefined,
      foreground: undefined,
      inventory: undefined,
      scenery: {
        background: undefined,
        foreground: undefined
      }
    }

    switch (type) {
      case 'character': var cityElementPrototype = characterPrototype; break
      case 'vehicle': cityElementPrototype = vehiclePrototype; break
      case 'room': cityElementPrototype = roomPrototype; break
      default:
    }

    var cityElement = {...cityElementPrototype}

    for (var property in cityElementPrototype) {
      var value = cityElementPrototype[property]
      if (Array.isArray(value)) cityElement[property] = [...value]
      else if (typeof value === 'object' && value !== null) {
        for (var nestedProperty in value) {
          var nestedValue = value[nestedProperty]
          if (typeof nestedValue !== 'object' || nestedValue === null) {
            cityElement[property][nestedProperty] = nestedValue
          }
          else cityElement[property][nestedProperty] = null
        }
      }
    }

    return cityElement
  }

  const entityKit = {

    length: _entities.length,

    create: (type, districtId, configuration) => {
      const {x, y, speed} = configuration || {}
      const districtWidth = 3200
      const districtHeight = 8000
      const directions = {
        character: ['left', 'right'],
        vehicle: ['left', 'right', 'up', 'down', 'up-left', 'up-right', 'down-left', 'down-right']
      }
      const percentages = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 0.1, 0.2,
        0.3, 0.4, 0.5, 0.6, 0.1, 0.2, 0.3, 0.4, 0.1, 0.2, 0.3, 0.3, 0.4]

      const cityElement = createCityElement(type)
      const cityElementClone = createCityElement(type)

      cityElement.district = districtId

      if (type !== 'room') {
        cityElement.direction = directions[type][Math.floor(Math.random() * directions[type].length)]
        cityElement.x = x ? x : Math.random() * (districtWidth - cityElement.width) // eslint-disable-line no-unneeded-ternary
      }
      if (type === 'vehicle') {
        var index = Math.floor(Math.random() * percentages.length)
        var percentage = percentages[index]
        cityElement.speed = (speed || speed === 0) ? speed : Math.round(Math.random() * cityElement.maxSpeed * percentage)
        cityElement.y = y ? y : Math.random() * (districtHeight - cityElement.height - 77) // eslint-disable-line no-unneeded-ternary
      }
      if (type === 'character') {
        cityElement.y = districtHeight - 168
        cityElement.speed = (speed || speed === 0) ? speed : Math.round(Math.random() * cityElement.maxSpeed)
      }

      cityElement.id = _entities.length
      cityElementClone.id = cityElement.id
      cityElement.elementId = 'o' + cityElement.id
      _entities.push(cityElement)

      const id = cityElement.id
      entityKit[id] = cityElementClone
      entityKit.clone(id)
      entityKit.refreshLength()

      return id
    },

    clone: id => {
      const cityElementClone = entityKit[id]
      const cityElement = _entities[id]

      for (var property in cityElement) {
        var value = cityElement[property]
        if (typeof value !== 'object' || value === null) {
          cityElementClone[property] = value
        }
        else if (Array.isArray(value)) {
          cityElementClone[property].length = 0
          value.forEach(item => cityElementClone[property].push(item))
        }
        else if (typeof value === 'object' && value !== null) {
          for (var nestedProperty in value) {
            var nestedValue = value[nestedProperty]
            if (typeof nestedValue !== 'object' || nestedValue === null) {
              cityElementClone[property][nestedProperty] = nestedValue
            }
          }
        }
      }

      return cityElementClone
    },

    cloneMultiple: (...idArrays) => {
      multiple.length = 0
      if (idArrays.length) {
        idArrays.forEach(idArray => {
          if (idArray) {
            idArray.forEach(id => {
              if (id) {
                var cityElementClone = entityKit.clone(id)
                multiple.push(cityElementClone)
              }
            })
          }
        })
      }
      return multiple
    },

    cloneAll: () => {
      all.length = 0
      _entities.forEach((item, id) => {
        var cityElement = entityKit.clone(id)
        all.push(cityElement)
      })
      return all
    },

    refreshLength: () => {
      entityKit.length = _entities.length
    },

    assignPlayer: (characterId, playerId) => {
      _entities[characterId].player = playerId
      entityKit[characterId].player = playerId
    },

    assignDistrict: (cityElementId, districtId) => {
      _entities[cityElementId].district = districtId
      entityKit[cityElementId].district = districtId
    },

    giveKey: (characterId, cityElementId, isMasterKey) => {
      var character = _entities[characterId]
      var cityElement = _entities[cityElementId]
      var type = cityElement.type

      switch (true) {
        case type === 'vehicle' && isMasterKey: var keysType = 'vehicleMasterKeys'; break
        case type === 'vehicle': keysType = 'vehicleKeys'; break
        case type === 'room' && isMasterKey: keysType = 'roomMasterKeys'; break
        case type === 'room': keysType = 'roomKeys'; break
        default:
      }

      var keys = character[keysType]
      var duplicateKey = keys.find(key => key === cityElementId)
      if (!duplicateKey) keys.push(cityElementId)
      if (isMasterKey) var keyHoldersType = 'masterKeyHolders'
      else keyHoldersType = 'keyHolders'
      var keyHolders = cityElement[keyHoldersType]
      var duplicateKeyHolder = keyHolders.find(keyHolder => keyHolder === characterId)
      if (!duplicateKeyHolder) keyHolders.push(characterId)
      if (isMasterKey) entityKit.giveKey(characterId, cityElementId)
    },

    checkForVehicleEntries: (characters, vehicles) => {
      const charactersToEnter = []
      const vehiclesToBeEntered = []
      const nonEntereringWalkers = []
      vehicles.forEach((vehicleId, index) => {
        var vehicle = _entities[vehicleId]
        var characterId = characters[index]
        var character = _entities[characterId]
        if (vehicle.driver) var driver = 1
        else driver = 0
        if (
          driver + vehicle.passengers.length < vehicle.seats &&
          character.x < vehicle.x + vehicle.width &&
          character.x + character.width > vehicle.x &&
          character.y < vehicle.y + vehicle.height &&
          character.y + character.height > vehicle.y
        ) {
          charactersToEnter.push(characterId)
          vehiclesToBeEntered.push(vehicleId)
        }
        else nonEntereringWalkers.push(character.id)
      })
      return {charactersToEnter, vehiclesToBeEntered, nonEntereringWalkers}
    },

    putCharactersInVehicles: (characterIds, vehicleIds) => {
      const charactersPutInVehicles = []
      const vehiclesCharactersWerePutIn = []
      const strandedWalkers = []
      characterIds.forEach((characterId, index) => {
        var character = _entities[characterId]
        var vehicleId = vehicleIds[index]
        var vehicle = _entities[vehicleId]
        var {driver, passengers, seats} = vehicle
        if (driver) {
          driver = 1
          if (driver + passengers.length < seats) {
            character.passenging = vehicleId
            character.active = 0
            vehicle.passengers.push(characterId)
            charactersPutInVehicles.push(characterId)
            vehiclesCharactersWerePutIn.push(vehicleId)
          }
          else strandedWalkers.push(characterId)
        }
        else {
          character.driving = vehicleId
          character.active = 0
          vehicle.driver = characterId
        }
      })
      return {charactersPutInVehicles, vehiclesCharactersWerePutIn, strandedWalkers}
    },

    active: function (characterId) {
      _entities[characterId].active += 1
    },

    inactive: function (characterId) {
      _entities[characterId].active = 0
    },

    exitVehicles: characterIds => {
      characterIds.forEach(characterId => {
        var {active, id} = _entities[characterId]
        if (active >= 30) entityKit.exitVehicle(id)
      })
    },

    exitVehicle: characterId => {
      var character = _entities[characterId]
      var {driving} = character
      var vehicle = _entities[driving]
      character.driving = 0
      character.passenging = 0
      character.active = 0
      vehicle.driver = 0
      vehicle.slowing = true
      vehicle.falling = true
    },

    graduallyStopVehicle: vehicle => {
      vehicle.speed -= vehicle.deceleration / 100
      if (vehicle.speed < 0) {
        vehicle.speed = 0
        vehicle.slowing = false
      }
    },

    fallVehicle: vehicle => {
      vehicle.y += 2
      if (vehicle.y < 7843) {
        vehicle.falling = false
        vehicle.y = 7843
      }
    },

    walk: (characterId, input) => {
      var character = _entities[characterId]
      var {right, left} = input
      if (right) {
        character.direction = 'right'
        character.speed = 5
      }
      else if (left) {
        character.direction = 'left'
        character.speed = 5
      }
      else character.speed = 0
    },

    drive: (characterId, input) => {
      var character = _entities[characterId]
      var vehicleId = character.driving
      var vehicle = _entities[vehicleId]
      var {up, down, left, right, accelerate, decelerate} = input
      var {direction} = vehicle
      if (direction !== 'up' && direction !== 'down') {
        vehicle.previousDirection = direction
      }

      switch (true) {
        case up && left: vehicle.direction = 'up-left'; break
        case up && right : vehicle.direction = 'up-right'; break
        case down && left: vehicle.direction = 'down-left'; break
        case down && right : vehicle.direction = 'down-right'; break
        case up: vehicle.direction = 'up'; break
        case down: vehicle.direction = 'down'; break
        case left: vehicle.direction = 'left'; break
        case right: vehicle.direction = 'right'; break
        default:
      }
      if (accelerate) vehicle.speed += vehicle.acceleration / 100
      if (decelerate) vehicle.speed -= vehicle.deceleration / 100
      if (vehicle.speed > vehicle.maxSpeed) vehicle.speed = vehicle.maxSpeed
      if (vehicle.speed < 0) vehicle.speed = 0
    },

    updateLocations: (districts) => {
      _entities.forEach(cityElement => {
        if (cityElement.id) {
          var {driving, passenging, occupying, type, slowing, falling} = cityElement
          if (driving || passenging) entityKit.updateTravelingCharacterLocation(cityElement)
          else if (occupying) entityKit.updateOccupyingCharacterLocation(cityElement, districts)
          else if (type === 'character') entityKit.updateWalkingCharacterLocation(cityElement, districts)
          else if (type === 'vehicle') {
            if (falling) entityKit.fallVehicle(cityElement)
            if (slowing) entityKit.graduallyStopVehicle(cityElement)
            entityKit.updateVehicleLocation(cityElement, districts)
          }
        }
      })
    },

    updateTravelingCharacterLocation: (character) => {
      var {driving, passenging} = character
      var vehicle = driving ? _entities[driving] : _entities[passenging]
      var {x, y, width, height} = vehicle
      character.x = x + width / 2
      character.y = y + height / 2
    },

    updateOccupyingCharacterLocation: (character, districts) => {
    },

    updateWalkingCharacterLocation: (character, districts) => {
      var {speed, direction, district, width, y} = character
      if (y < 7832) {
        character.y += 6
      }
      else if (y > 7832) character.y = 7832
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
      var {speed, direction, district, width, height, driver, y} = vehicle
      var distance = Math.pow((speed / 2), 2)
      var maxY = districts[district].height - height - 77
      if (y > maxY) vehicle.y = maxY

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
      if (driver) var character = _entities[driver]
      if (driver && character.player) {

        if (nextX < min) {
          vehicle.x = min
        }
        if (nextX > maxX) {
          vehicle.x = maxX
        }
        if (nextY < min) {
          vehicle.y = min
        }
        if (nextY > maxY) {
          vehicle.y = maxY
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
      var characterId = null
      var latency = null
      latencies.forEach((item, index) => {
        if (!(index % 2) || index === 0) characterId = item
        else latency = item
        if (characterId && latency) {
          _entities[characterId].latency = latency
          characterId = null
          latency = null
        }
      })
    },

    emit: (io) => {
      _entities[0].timestamp = now()
      io.volatile.emit('entities', _entities)
    }
  }

  return entityKit
}
