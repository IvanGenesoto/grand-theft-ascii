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
      playerId: null,
      latency: null,
      districtId: null,
      drivingId: null,
      passengingId: null,
      occupyingId: null,
      vehicleMasterKeys: [],
      vehicleKeys: [],
      vehicleWelcomeIds: [],
      roomMasterKeys: [],
      roomKeys: [],
      x: null,
      y: null,
      width: 70,
      height: 103,
      depth: 1,
      direction: 'right',
      speed: null,
      maxSpeed: 10,
      isActive: false,
      tag: 'img',
      elementId: null,
      src: 'images/characters/man.png'
    }
    const vehiclePrototype = {
      id: null,
      type: 'vehicle',
      model: 'delorean',
      status: 'operational',
      districtId: null,
      seatCount: 2,
      driverId: null,
      masterKeyHolderIds: [],
      keyHolderIds: [],
      welcomIds: [],
      passengerIds: [],
      x: null,
      y: null,
      width: 268,
      height: 80,
      direction: 'right',
      previousDirection: null,
      speed: null,
      maxSpeed: 70,
      isSlowing: false,
      isDescending: false,
      acceleration: 0.4,
      deceleration: 0.8,
      armorLevel: 0,
      weight: 2712,
      tag: 'img',
      elementId: null,
      src: 'images/vehicles/delorean.png'
    }
    const roomPrototype = {
      id: null,
      type: 'room',
      name: 'Pad',
      status: 'locked',
      districtId: null,
      capacity: 50,
      occupantIds: [],
      masterKeyHolderIds: [],
      keyHolderIds: [],
      unwelcomeIds: [],
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      tag: 'canvas',
      background: null,
      foreground: null,
      inventory: [],
      backgroundLayers: [],
      foregroundLayers: []
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
    const {characterIds} = this
    const {characterIdsToEnter, vehicleIdsToBeEntered, nonEntereringWalkerIdss} = entryKit
    const characterId = characterIds[index]
    const character = _entities[characterId]
    const vehicle = _entities[vehicleId]
    const {driverId, passengerIds, seatCount} = vehicle
    const {length: passengerCount} = passengerIds
    const driverCount = driverId ? 1 : 0
    const isEntry =
         driverCount + passengerCount < seatCount
      && character.x < vehicle.x + vehicle.width
      && character.x + character.width > vehicle.x
      && character.y < vehicle.y + vehicle.height
      && character.y + character.height > vehicle.y
    if (!isEntry) return nonEntereringWalkerIdss.push(character.id) && entryKit
    characterIdsToEnter.push(characterId)
    vehicleIdsToBeEntered.push(vehicleId)
    return entryKit
  }

  const pushIfCanBePut = function (puttedKit, characterId, index) {
    const {vehicleIds} = this
    const {characterIdsPutInVehicles, vehicleIdsCharactersWerePutIn, strandedWalkerIdss} = puttedKit
    const vehicleId = vehicleIds[index]
    const vehicle = _entities[vehicleId]
    const character = _entities[characterId]
    const {driverId, passengerIds, seatCount} = vehicle
    const {length: passengerCount} = passengerIds
    if (driverId && passengerCount + 1 >= seatCount) return strandedWalkerIdss.push(characterId)
    if (driverId) {
      character.passengingId = vehicleId
      vehicle.passengerIds.push(characterId)
      character.isActive = false
      characterIdsPutInVehicles.push(characterId)
      vehicleIdsCharactersWerePutIn.push(vehicleId)
      return puttedKit
    }
    character.drivingId = vehicleId
    vehicle.driverId = characterId
    character.isActive = false
    return puttedKit
  }

  const exitVehicleAsPassenger = (characterId, vehicle) => {
    const {passengerIds} = vehicle
    const index = passengerIds.indexOf(characterId)
    index + 1 && passengerIds.splice(index, 1)
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
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        1,
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.6,
        0.1,
        0.2,
        0.3,
        0.4,
        0.1,
        0.2,
        0.3,
        0.3,
        0.4
      ]
      const entity = createEntity(type)
      const entityClone = createEntity(type)
      const id = entity.id = _entities.length
      entity.districtId = districtId
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
      _entities[characterId].playerId = playerId
      this[characterId].playerId = playerId
    },

    assignDistrict: function (entityId, districtId) {
      const entity = _entities[entityId]
      entity.districtId = districtId
      this[entityId].districtId = districtId
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
      const keyHoldersType = isMasterKey ? 'masterKeyHolderIds' : 'keyHolderIds'
      const keyHolderIds = entity[keyHoldersType]
      const duplicateKeyHolderId = keyHolderIds.find(keyHolder => keyHolder === characterId)
      duplicateKeyHolderId || keyHolderIds.push(characterId)
      isMasterKey && this.giveKey(characterId, entityId)
    },

    checkForVehicleEntries: (characterIds, vehicleIds) => {
      const entryKit = {
        characterIdsToEnter: [],
        vehicleIdsToBeEntered: [],
        nonEntereringWalkerIdss: []
      }
      const pushIfVehicleEntryWithThis = pushIfVehicleEntry.bind({characterIds})
      return vehicleIds.reduce(pushIfVehicleEntryWithThis, entryKit)
    },

    putCharactersInVehicles: (characterIds, vehicleIds) => {
      const puttedKit = {
        characterIdsPutInVehicles: [],
        vehicleIdsCharactersWerePutIn: [],
        strandedWalkerIdss: []
      }
      const pushIfCanBePutWithThis = pushIfCanBePut.bind({vehicleIds})
      characterIds.reduce(pushIfCanBePutWithThis, puttedKit)
      return puttedKit
    },

    activate: characterId => _entities[characterId].isActive = true,

    inactivate: characterId => _entities[characterId].isActive = false,

    exitVehicles: function (characterIds) {
      characterIds.forEach(characterId => this.exitVehicle(characterId))
    },

    exitVehicle: characterId => {
      const character = _entities[characterId]
      const {isActive, drivingId, passengingId} = character
      const vehicleId = drivingId || passengingId
      const vehicle = _entities[vehicleId]
      if (!isActive || !vehicle) return
      character.drivingId = null
      character.passengingId = null
      character.isActive = false
      drivingId && (vehicle.driverId = null)
      passengingId && exitVehicleAsPassenger(characterId, vehicle)
      drivingId && (vehicle.isSlowing = true)
      drivingId && (vehicle.isDescending = true)
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
      vehicle.isSlowing = false
    },

    descendVehicle: vehicle => {
      vehicle.y += 5
      if (vehicle.y < 7843) return
      vehicle.isDescending = false
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
      const vehicleId = character.drivingId
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
        const {id, drivingId, passengingId, occupyingId, type, isSlowing, isDescending} = entity
        if (!id) return
        if (drivingId || passengingId) return this.updateTravelingCharacterLocation(entity)
        if (occupyingId) return this.updateOccupyingCharacterLocation(entity, districts)
        if (type === 'character') return this.updateWalkingCharacterLocation(entity, districts)
        if (type !== 'vehicle') return
        if (isDescending) this.descendVehicle(entity)
        if (isSlowing) this.slowDownVehicle(entity)
        this.updateVehicleLocation(entity, districts)
      })
      return this
    },

    updateTravelingCharacterLocation: character => {
      const {drivingId, passengingId} = character
      const vehicle = drivingId ? _entities[drivingId] : _entities[passengingId]
      const {x, y, width, height, direction} = vehicle
      const leftDirections = ['left', 'up-left', 'down-left']
      const rightDirections = ['right', 'up-right', 'down-right']
      character.x = x + width / 2 - character.width / 2
      character.y = y + height / 2 - character.height / 2 - 5
      leftDirections.includes(direction) && (character.direction = 'left')
      rightDirections.includes(direction) && (character.direction = 'right')
    },

    updateOccupyingCharacterLocation: (character, districts) => { // eslint-disable-line no-unused-vars
    },

    updateWalkingCharacterLocation: (character, districts) => {
      const {speed, direction, districtId, width, player, x, y} = character
      const district = districts[districtId]
      const {width: districtWidth} = district
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
      const {speed, direction, districtId, width, height, driverId, x, y} = vehicle
      const character = driverId && _entities[driverId]
      const {playerId} = character || {}
      const district = districts[districtId]
      const {height: districtHeight, width: districtWidth} = district
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
      if (playerId) {
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
