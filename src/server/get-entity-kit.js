import now from 'performance-now'

export const getEntityKit = function () {

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
      maxSpeed: 75,
      isSlowing: false,
      isDescending: false,
      acceleration: 0.6,
      deceleration: 1.2,
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

  const pushIfVehicleEntry = (entryKit, vehicleId, index) => {
    const {
      characterIdsToEnter,
      vehicleIdsToBeEntered,
      nonEntereringWalkerIdss,
      characterIds,
      _entities
    } = entryKit
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

  const pushIfCanBePut = (puttedKit, characterId, index) => {
    const {
      characterIdsPutInVehicles,
      vehicleIdsCharactersWerePutIn,
      strandedWalkerIdss,
      vehicleIds,
      _entities
    } = puttedKit
    const vehicleId = vehicleIds[index]
    const vehicle = _entities[vehicleId]
    const character = _entities[characterId]
    const {driverId, passengerIds, seatCount} = vehicle
    const {length: passengerCount} = passengerIds
    if (driverId && passengerCount + 1 >= seatCount) return strandedWalkerIdss.push(characterId)
    if (driverId) {
      character.passengingId = vehicleId
      vehicle.passengerIds.push(characterId)
      characterIdsPutInVehicles.push(characterId)
      vehicleIdsCharactersWerePutIn.push(vehicleId)
      return puttedKit
    }
    character.drivingId = vehicleId
    vehicle.driverId = characterId
    return puttedKit
  }

  const exitVehicleAsPassenger = (characterId, vehicle) => {
    const {passengerIds} = vehicle
    const index = passengerIds.indexOf(characterId)
    index + 1 && passengerIds.splice(index, 1)
  }

  const getNewDirection = ({up, down, left, right}) =>
      up && left ? 'up-left'
    : up && right ? 'up-right'
    : down && left ? 'down-left'
    : down && right ? 'down-right'
    : up ? 'up'
    : down ? 'down'
    : left ? 'left'
    : right ? 'right'
    : null

  const isVehicleDecelerating = (direction, newDirection) =>
       (direction === 'up' && newDirection === 'down')
    || (direction === 'up' && newDirection === 'down-left')
    || (direction === 'up' && newDirection === 'down-right')
    || (direction === 'up-right' && newDirection === 'down-left')
    || (direction === 'up-right' && newDirection === 'left')
    || (direction === 'up-right' && newDirection === 'down')
    || (direction === 'right' && newDirection === 'left')
    || (direction === 'right' && newDirection === 'up-left')
    || (direction === 'right' && newDirection === 'down-left')
    || (direction === 'down-right' && newDirection === 'up-left')
    || (direction === 'down-right' && newDirection === 'up')
    || (direction === 'down-right' && newDirection === 'left')
    || (direction === 'down' && newDirection === 'up')
    || (direction === 'down' && newDirection === 'up-right')
    || (direction === 'down' && newDirection === 'up-left')
    || (direction === 'down-left' && newDirection === 'up-right')
    || (direction === 'down-left' && newDirection === 'right')
    || (direction === 'down-left' && newDirection === 'up')
    || (direction === 'left' && newDirection === 'right')
    || (direction === 'left' && newDirection === 'down-right')
    || (direction === 'left' && newDirection === 'up-right')
    || (direction === 'up-left' && newDirection === 'down-right')
    || (direction === 'up-left' && newDirection === 'down')
    || (direction === 'up-left' && newDirection === 'right')

  const isVehicleTurning = (direction, newDirection) =>
       (direction === 'up' && newDirection === 'left')
    || (direction === 'up' && newDirection === 'right')
    || (direction === 'up' && newDirection === 'up-left')
    || (direction === 'up' && newDirection === 'up-right')
    || (direction === 'up-right' && newDirection === 'up-left')
    || (direction === 'up-right' && newDirection === 'down-right')
    || (direction === 'right' && newDirection === 'up')
    || (direction === 'right' && newDirection === 'down')
    || (direction === 'down-right' && newDirection === 'up-right')
    || (direction === 'down-right' && newDirection === 'down-left')
    || (direction === 'down' && newDirection === 'right')
    || (direction === 'down' && newDirection === 'left')
    || (direction === 'down' && newDirection === 'down-right')
    || (direction === 'down' && newDirection === 'down-left')
    || (direction === 'down-left' && newDirection === 'down-right')
    || (direction === 'down-left' && newDirection === 'up-left')
    || (direction === 'left' && newDirection === 'down')
    || (direction === 'left' && newDirection === 'up')
    || (direction === 'up-left' && newDirection === 'down-left')
    || (direction === 'up-left' && newDirection === 'up-right')

  const isVehicleStrafing = (direction, newDirection) =>
       (direction === 'up-right' && newDirection === 'up')
    || (direction === 'up-right' && newDirection === 'right')
    || (direction === 'right' && newDirection === 'up-right')
    || (direction === 'right' && newDirection === 'down-right')
    || (direction === 'down-right' && newDirection === 'right')
    || (direction === 'down-right' && newDirection === 'down')
    || (direction === 'down-left' && newDirection === 'down')
    || (direction === 'down-left' && newDirection === 'left')
    || (direction === 'left' && newDirection === 'down-left')
    || (direction === 'left' && newDirection === 'up-left')
    || (direction === 'up-left' && newDirection === 'left')
    || (direction === 'up-left' && newDirection === 'up')

  const entityKit = {

    create: function (type, _entities, districtId, configuration) {
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
      const id = entity.id = _entities.length
      entity.districtId = districtId
      entity.elementId = 'o' + id
      _entities.push(entity)
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

    assignPlayer: (characterId, playerId, _entities) => _entities[characterId].playerId = playerId,

    assignDistrict: function (entityId, districtId, _entities) {
      const entity = _entities[entityId]
      entity.districtId = districtId
    },

    giveKey: (characterId, entityId, _entities, isMasterKey) => {
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
      isMasterKey && entityKit.giveKey(characterId, entityId, _entities)
    },

    checkForVehicleEntries: (
      characterIds, vehicleIds, _entities
    ) => vehicleIds.reduce(pushIfVehicleEntry, {
      characterIdsToEnter: [],
      vehicleIdsToBeEntered: [],
      nonEntereringWalkerIdss: [],
      characterIds,
      _entities
    }),

    putCharactersInVehicles: (
      characterIds, vehicleIds, _entities
    ) => characterIds.reduce(pushIfCanBePut, {
      characterIdsPutInVehicles: [],
      vehicleIdsCharactersWerePutIn: [],
      strandedWalkerIdss: [],
      vehicleIds,
      _entities
    }),

    exitVehicle: function (characterId) {
      const {_entities} = this
      const character = _entities[characterId]
      const {drivingId, passengingId} = character
      const vehicleId = drivingId || passengingId
      const vehicle = _entities[vehicleId]
      character.drivingId = null
      character.passengingId = null
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

    walk: (characterId, input, _entities) => {
      const character = _entities[characterId]
      const {direction, maxSpeed} = character
      const {right, left} = input
      character.speed = right || left ? maxSpeed : 0
      character.direction =
          right ? 'right'
        : left ? 'left'
        : direction
    },

    drive: (characterId, input, _entities) => {
      const character = _entities[characterId]
      const vehicleId = character.drivingId
      const vehicle = _entities[vehicleId]
      const {direction, speed, maxSpeed, acceleration, deceleration} = vehicle
      const newDirection = getNewDirection(input)
      const isAccelerating = newDirection === direction
      const isDecelerating = speed && isVehicleDecelerating(direction, newDirection)
      const isTurning = isVehicleTurning(direction, newDirection)
      const isStrafing = isVehicleStrafing(direction, newDirection)
      direction !== 'up' && direction !== 'down' && (vehicle.previousDirection = direction)
      vehicle.direction = !isDecelerating && newDirection ? newDirection : direction
      isTurning && (vehicle.speed /= 4)
      isStrafing && (vehicle.speed *= 0.9)
      isAccelerating && (vehicle.speed += acceleration)
      isDecelerating && (vehicle.speed -= deceleration)
      vehicle.speed > maxSpeed && (vehicle.speed = maxSpeed)
      vehicle.speed < 0 && (vehicle.speed = 0)
      vehicle.speed < 2 && !isAccelerating && (vehicle.speed = 0)
    },

    updateLocation: function (entity) {
      const {state} = this
      const {_districts, _entities} = state
      const {id, drivingId, passengingId, occupyingId, type, isSlowing, isDescending} = entity
      if (!id) return
      if (drivingId || passengingId) return entityKit.updateTravelingCharacterLocation(entity, _entities)
      if (occupyingId) return entityKit.updateOccupyingCharacterLocation(entity, _districts)
      if (type === 'character') return entityKit.updateWalkingCharacterLocation(entity, _districts)
      if (type !== 'vehicle') return
      if (isDescending) entityKit.descendVehicle(entity)
      if (isSlowing) entityKit.slowDownVehicle(entity)
      entityKit.updateVehicleLocation(entity, _districts, _entities)
    },

    updateTravelingCharacterLocation: (character, _entities) => {
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

    updateWalkingCharacterLocation: (character, _districts) => {
      const {speed, direction, districtId, width, playerId, x} = character
      const district = _districts[districtId]
      const {width: districtWidth} = district
      const maxX = districtWidth - width
      character.y < 0 && (character.y = 0)
      character.y < 7832 && (character.y += 20)
      character.y > 7832 && (character.y = 7832)
      if (speed <= 0) return
      character.x = direction === 'left' ? x - speed : x + speed
      if (playerId) {
        character.x < 0 && (character.x = 0)
        character.x > maxX && (character.x = maxX)
        return
      }
      character.x < 0 && (character.direction = 'right')
      character.x > maxX && (character.direction = 'left')
    },

    updateVehicleLocation(vehicle, _districts, _entities) {
      const {stopVehicle} = this
      const {speed, direction, districtId, width, height, driverId, x, y} = vehicle
      const character = driverId && _entities[driverId]
      const {playerId} = character || {}
      const district = _districts[districtId]
      const {height: districtHeight, width: districtWidth} = district
      const distance = Math.sqrt(speed ** 2 * 2)
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
        x_ <= 0 && stopVehicle(vehicle) && (vehicle.x = 0)
        x_ >= maxX && stopVehicle(vehicle) && (vehicle.x = maxX)
        y_ < 0 && (vehicle.y = 0)
        y_ > maxY && (vehicle.y = maxY)
        return
      }
      x_ < 0 && (vehicle.x = 0)
      x_ > maxX && (vehicle.x = maxX)
      y_ < 0 && (vehicle.y = 0)
      y_ > maxY && (vehicle.y = maxY)
      if (x_ >= 0 && x_ <= maxX && y_ >= 0 && y_ <= maxY) return
      const {length: directionCount} = directions
      const float = Math.random() * directionCount
      const index = Math.floor(float)
      vehicle.direction = directions[index]
    },

    stopVehicle: vehicle => (vehicle.speed = 0) || vehicle,

    updateLatencies: function (latencyKit) {
      const {_entities} = this
      if (!latencyKit) return
      const {characterId, latency} = latencyKit
      const character = _entities[characterId]
      character.latency = latency
    },

    handleTick: (tick, characterId, _entities) => {
      const character = _entities[characterId]
      character.tick = tick
    },

    emit: (io, _entities) => {
      const [mayor] = _entities
      mayor.timestamp = now()
      io.volatile.emit('entities', _entities)
    }
  }

  return entityKit
}
