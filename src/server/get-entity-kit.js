import now from 'performance-now'

export const getEntityKit = function (_entities = []) {

  const all = []
  const multiple = []

  function createEntity(type) {
    const characterPrototype = {
      id: null,
      type: 'character',
      name: 'Fred',
      status: 'alive',
      player: null,
      tick: null,
      latency: null,
      district: null,
      driving: null,
      passenging: null,
      occupying: null,
      vehicleMasterKeys: [],
      vehicleKeys: [],
      vehicleWelcomes: [],
      roomMasterKeys: [],
      roomKeys: [],
      x: null,
      y: null,
      width: 105,
      height: 155,
      depth: 1,
      direction: null,
      speed: null,
      maxSpeed: 10,
      active: 0,
      tag: 'img',
      elementId: null,
      src: 'images/characters/man.png'
    }
    const vehiclePrototype = {
      id: null,
      type: 'vehicle',
      model: 'delorean',
      status: 'operational',
      district: null,
      seats: 2,
      driver: 0,
      masterKeyHolders: [],
      keyHolders: [],
      welcomes: [],
      passengers: [],
      x: null,
      y: null,
      width: 268,
      height: 80,
      direction: null,
      previousDirection: null,
      speed: null,
      maxSpeed: 50,
      speedAtExit: null,
      slowing: false,
      falling: false,
      acceleration: 0.4,
      deceleration: 0.8,
      armor: null,
      weight: 0,
      tag: 'img',
      elementId: null,
      src: 'images/vehicles/delorean.png'
    }
    const roomPrototype = {
      id: null,
      type: 'room',
      name: 'Pad',
      status: 'locked',
      district: null,
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
      background: null,
      foreground: null,
      inventory: null,
      scenery: {
        background: null,
        foreground: null
      }
    }
    const prototype =
        type === 'character' ? characterPrototype
      : type === 'vehicle' ? vehiclePrototype
      : roomPrototype
    return Object
      .entries(prototype)
      .reduce(appendAttribute, {})
  }

  const appendAttribute = (district, [key, value]) => {
    district[key] =
        Array.isArray(value) ? [...value]
      : value && value === 'object' ? {...value}
      : value
    return district
  }

  const pushIfVehicleEntry = function (entryKit, vehicleId, index) {
    const {characters} = this
    const {charactersToEnter, vehiclesToBeEntered, nonEntereringWalkers} = entryKit
    const characterId = characters[index]
    const character = _entities[characterId]
    const vehicle = _entities[vehicleId]
    const {driver} = vehicle
    const driverCount = driver ? 1 : 0
    const isEntry =
         driverCount + vehicle.passengers.length < vehicle.seats
      && character.x < vehicle.x + vehicle.width
      && character.x + character.width > vehicle.x
      && character.y < vehicle.y + vehicle.height
      && character.y + character.height > vehicle.y
    if (!isEntry) return nonEntereringWalkers.push(character.id) && entryKit
    charactersToEnter.push(characterId)
    vehiclesToBeEntered.push(vehicleId)
    return entryKit
  }

  const pushIfCanBePut = function (puttedKit, characterId, index) {
    const {vehicleIds} = this
    const {charactersPutInVehicles, vehiclesCharactersWerePutIn, strandedWalkers} = puttedKit
    const vehicleId = vehicleIds[index]
    const vehicle = _entities[vehicleId]
    const character = _entities[characterId]
    const {driver, passengers, seats} = vehicle
    const {length: passengerCount} = passengers
    driver && passengerCount + 1 >= seats && strandedWalkers.push(characterId)
    if (driver) {
      character.passenging = vehicleId
      character.active = 0
      vehicle.passengers.push(characterId)
      charactersPutInVehicles.push(characterId)
      vehiclesCharactersWerePutIn.push(vehicleId)
    }
    else {
      character.driving = vehicleId
      character.active = 0
      vehicle.driver = characterId
    }
    return puttedKit
  }

  const entityKit = {

    length: _entities.length,

    create: function (type, districtId, configuration) {
      const {x, y, speed} = configuration || {}
      const districtWidth = 3200
      const districtHeight = 8000
      const directionsByType = {
        character: ['left', 'right'],
        vehicle: ['left', 'right', 'up', 'down', 'up-left', 'up-right', 'down-left', 'down-right']
      }
      const directions = directionsByType[type]
      const percentages = [
        0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 0.1, 0.2, 0.3,
        0.4, 0.5, 0.6, 0.1, 0.2, 0.3, 0.4, 0.1, 0.2, 0.3, 0.3, 0.4
      ]
      const entity = createEntity(type)
      const entityClone = createEntity(type)
      const id = entity.id = _entities.length
      entity.district = districtId
      entityClone.id = id
      entity.elementId = 'o' + id
      _entities.push(entity)
      this[id] = entityClone
      this.clone(id)
      this.refreshLength()
      if (type !== 'room') {
        const float = Math.random() * directions.length
        const index = Math.floor(float)
        entity.direction = directions[index]
        entity.x = x || x === 0 ? x : Math.random() * (districtWidth - entity.width)
      }
      if (type === 'vehicle') {
        const float = Math.random() * percentages.length
        const index = Math.floor(float)
        const percentage = percentages[index]
        entity.speed = speed || speed === 0 ? speed : Math.random() * entity.maxSpeed * percentage
        entity.y = y || y === 0 ? y : Math.random() * (districtHeight - entity.height - 77)
      }
      if (type === 'character') {
        entity.y = districtHeight - 168
        entity.speed = speed || speed === 0 ? speed : Math.random() * entity.maxSpeed
      }
      return id
    },

    clone: function (id) {
      const entityClone = this[id]
      const entity = _entities[id]

      for (var property in entity) {
        var value = entity[property]
        if (typeof value !== 'object' || value === null) {
          entityClone[property] = value
        }
        else if (Array.isArray(value)) {
          entityClone[property].length = 0
          value.forEach(item => entityClone[property].push(item))
        }
        else if (typeof value === 'object' && value !== null) {
          for (var nestedProperty in value) {
            var nestedValue = value[nestedProperty]
            if (typeof nestedValue !== 'object' || nestedValue === null) {
              entityClone[property][nestedProperty] = nestedValue
            }
          }
        }
      }

      return entityClone
    },

    cloneMultiple: function (...idArrays) {
      multiple.length = 0
      if (idArrays.length) {
        idArrays.forEach(idArray => {
          if (idArray) {
            idArray.forEach(id => {
              if (id) {
                var entityClone = this.clone(id)
                multiple.push(entityClone)
              }
            })
          }
        })
      }
      return multiple
    },

    cloneAll: function () {
      all.length = 0
      _entities.forEach((unusedItem, id) => {
        var entity = this.clone(id)
        all.push(entity)
      })
      return all
    },

    refreshLength: function () {
      this.length = _entities.length
    },

    assignPlayer: function (characterId, playerId) {
      _entities[characterId].player = playerId
      this[characterId].player = playerId
    },

    assignDistrict: function (entityId, districtId) {
      _entities[entityId].district = districtId
      this[entityId].district = districtId
    },

    giveKey: function (characterId, entityId, isMasterKey) {
      const character = _entities[characterId]
      const entity = _entities[entityId]
      const type = entity.type
      const keysType =
          type === 'vehicle' && isMasterKey ? 'vehicleMasterKeys'
        : type === 'vehicle' ? 'vehicleKeys'
        : type === 'room' && isMasterKey ? 'roomMasterKeys'
        : 'roomKeys'
      const keys = character[keysType]
      const duplicateKey = keys.find(key => key === entityId)
      duplicateKey || keys.push(entityId)
      const keyHoldersType = isMasterKey ? 'masterKeyHolders' : 'keyHolders'
      const keyHolders = entity[keyHoldersType]
      const duplicateKeyHolder = keyHolders.find(keyHolder => keyHolder === characterId)
      duplicateKeyHolder || keyHolders.push(characterId)
      isMasterKey && this.giveKey(characterId, entityId)
    },

    checkForVehicleEntries: (characters, vehicles) => {
      const entryKit = {
        charactersToEnter: [],
        vehiclesToBeEntered: [],
        nonEntereringWalkers: []
      }
      const pushIfVehicleEntryWithThis = pushIfVehicleEntry.bind({characters})
      return vehicles.reduce(pushIfVehicleEntryWithThis, entryKit)
    },

    putCharactersInVehicles: (characterIds, vehicleIds) => {
      const puttedKit = {
        charactersPutInVehicles: [],
        vehiclesCharactersWerePutIn: [],
        strandedWalkers: []
      }
      const pushIfCanBePutWithThis = pushIfCanBePut.bind({vehicleIds})
      characterIds.reduce(pushIfCanBePutWithThis, puttedKit)
      return puttedKit
    },

    active: characterId => _entities[characterId].active += 1,
    inactive: characterId => _entities[characterId].active = 0,

    exitVehicles: function (characterIds) {
      characterIds.forEach(characterId => {
        const entity = _entities[characterId]
        const {active} = entity
        if (active >= 15) this.exitVehicle(characterId)
      })
    },

    exitVehicle: characterId => {
      const character = _entities[characterId]
      const {driving} = character
      const vehicle = _entities[driving]
      character.driving = 0
      character.passenging = 0
      character.active = 0
      vehicle.driver = 0
      vehicle.slowing = true
      vehicle.falling = true
    },

    slowDownVehicle: vehicle => {
      const {speed, maxSpeed} = vehicle
      const percentage = speed / maxSpeed
      const multiplier =
          percentage > 0.5 ? percentage * 2
        : percentage > 0.25 ? 1
        : 0.5
      vehicle.speed -= vehicle.deceleration * multiplier
      if (vehicle.speed > 0) return
      vehicle.speed = 0
      vehicle.speedAtExit = null
      vehicle.slowing = false
    },

    descendVehicle: vehicle => {
      vehicle.y += 5
      if (vehicle.y < 7843) return
      vehicle.falling = false
      vehicle.y = 7843
    },

    walk: (characterId, input) => {
      const character = _entities[characterId]
      const {direction, maxSpeed} = character
      const {right, left} = input
      character.speed = right || left ? maxSpeed : 0
      character.direction =
          right ? 'right'
        : left ? 'left'
        : direction
    },

    drive: (characterId, input) => {
      const character = _entities[characterId]
      const vehicleId = character.driving
      const vehicle = _entities[vehicleId]
      const {up, down, left, right, accelerate, decelerate} = input
      const {direction} = vehicle
      direction !== 'up' && direction !== 'down' && (vehicle.previousDirection = direction)
      vehicle.direction =
          up && left ? 'up-left'
        : up && right ? 'up-right'
        : down && left ? 'down-left'
        : down && right ? 'down-right'
        : up ? 'up'
        : down ? 'down'
        : left ? 'left'
        : right ? 'right'
        : direction
      accelerate && (vehicle.speed += vehicle.acceleration)
      decelerate && (vehicle.speed -= vehicle.deceleration)
      vehicle.speed > vehicle.maxSpeed && (vehicle.speed = vehicle.maxSpeed)
      vehicle.speed < 0 && (vehicle.speed = 0)
    },

    updateLocations: function (districts) {
      _entities.forEach(entity => {
        const {id, driving, passenging, occupying, type, slowing, falling} = entity
        if (!id) return
        if (driving || passenging) return this.updateTravelingCharacterLocation(entity)
        if (occupying) return this.updateOccupyingCharacterLocation(entity, districts)
        if (type === 'character') return this.updateWalkingCharacterLocation(entity, districts)
        if (type !== 'vehicle') return
        if (falling) this.descendVehicle(entity)
        if (slowing) this.slowDownVehicle(entity)
        this.updateVehicleLocation(entity, districts)
      })
      return this
    },

    updateTravelingCharacterLocation: character => {
      const {driving, passenging} = character
      const vehicle = driving ? _entities[driving] : _entities[passenging]
      const {x, y, width, height} = vehicle
      character.x = x + width / 2
      character.y = y + height / 2
    },

    updateOccupyingCharacterLocation: (character, districts) => { // eslint-disable-line no-unused-vars
    },

    updateWalkingCharacterLocation: (character, districts) => {
      const {speed, direction, district, width, player, x, y} = character
      const district_ = districts[district]
      const {width: districtWidth} = district_
      y < 7832 && (character.y += 20)
      y > 7832 && (character.y = 7832)
      if (speed <= 0) return
      const x_ = character.x = direction === 'left' ? x - speed : x + speed
      const max = districtWidth - width
      if (player) {
        x_ < 0 && (character.x = 0)
        x_ > max && (character.x = max)
        return
      }
      x_ < 0 && (character.direction = 'right')
      x_ > max && (character.direction = 'left')
    },

    updateVehicleLocation: (vehicle, districts) => {
      const {speed, direction, district, width, height, driver, x, y} = vehicle
      const character = driver && _entities[driver]
      const {player} = character || {}
      const district_ = districts[district]
      const {height: districtHeight, width: districtWidth} = district_
      const distance = Math.sqrt(speed ** 2 * 2)
      const min = 0
      const maxX = districtWidth - width
      const maxY = districtHeight - height - 77
      const x_ = vehicle.x =
          direction === 'left' ? x - speed
        : direction === 'right' ? x + speed
        : direction === 'up-right' ? x + distance
        : direction === 'down-right' ? x + distance
        : direction === 'up-left' ? x - distance
        : direction === 'down-left' ? x - distance
        : x
      const y_ = vehicle.y =
          y > maxY ? maxY
        : direction === 'up' ? y - speed
        : direction === 'down' ? y + speed
        : direction === 'up-right' ? y - distance
        : direction === 'down-right' ? y + distance
        : direction === 'up-left' ? y - distance
        : direction === 'down-left' ? y + distance
        : y
      const directions =
          direction === 'up' ? ['left', 'right', 'down', 'down-left', 'down-right', 'down-left', 'down-right']
        : direction === 'down' ? ['left', 'right', 'up', 'up-left', 'up-right', 'up-left', 'up-right']
        : direction === 'left' ? ['up', 'down', 'right', 'up-right', 'down-right', 'right', 'up-right', 'down-right']
        : direction === 'right' ? ['up', 'down', 'up-left', 'down-left', 'left', 'up-left', 'down-left', 'left']
        : direction === 'up-right' ? ['left', 'up-left', 'down-left', 'down-right']
        : direction === 'down-right' ? ['left', 'up-left', 'up-right', 'down-left']
        : direction === 'up-left' ? ['right', 'up-right', 'down-left', 'down-right']
        : direction === 'down-left' ? ['right', 'up-left', 'up-right', 'down-right']
        : direction
      if (player) {
        x_ < min && (vehicle.x = min)
        x_ > maxX && (vehicle.x = maxX)
        y_ < min && (vehicle.y = min)
        y_ > maxY && (vehicle.y = maxY)
        return
      }
      x_ < min && (vehicle.x = min)
      x_ > maxX && (vehicle.x = maxX)
      y_ < min && (vehicle.y = min)
      y_ > maxY && (vehicle.y = maxY)
      if (x_ >= min && x_ <= maxX && y_ >= min && y_ <= maxY) return
      const {length: directionCount} = directions
      const float = Math.random() * directionCount
      const index = Math.floor(float)
      vehicle.direction = directions[index]
    },

    updateLatencies: latencyKits => {
      latencyKits.forEach(latencyKit => {
        if (!latencyKit) return
        const {characterId, latency} = latencyKit
        const character = _entities[characterId]
        character.latency = latency
      })
    },

    handleTick: (tick, characterId) => {
      const character = _entities[characterId]
      character.tick = tick
    },

    emit: io => {
      const [mayor] = _entities
      mayor.timestamp = now()
      io.volatile.emit('entities', _entities)
    }
  }

  return entityKit
}
