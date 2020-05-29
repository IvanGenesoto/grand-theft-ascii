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
    const prototype = type === 'character' ? characterPrototype : vehiclePrototype
    return Object
      .entries(prototype)
      .reduce(appendAttribute, {})
  }

  const appendAttribute = (entity, [key, value]) => {
    entity[key] =
        Array.isArray(value) ? [...value]
      : value && value === 'object' ? {...value}
      : value
    return entity
  }

  const exitVehicleAsPassenger = (characterId, vehicle) => {
    const {passengerIds} = vehicle
    const index = passengerIds.indexOf(characterId)
    index + 1 && passengerIds.splice(index, 1)
    return vehicle
  }

  const entityKit = {

    create: function (type, state, configuration) {
      const {_entities, city = {}} = state
      const {x, y, speed} = configuration || {}
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
      entity.elementId = 'o' + id
      _entities.push(entity)
      if (type !== 'room') {
        const float = Math.random() * directions.length
        const index = Math.floor(float)
        entity.direction = directions[index]
        entity.x = x || x === 0 ? x : Math.random() * (city.width - entity.width)
      }
      if (type === 'vehicle') {
        const float = Math.random() * percentages.length
        const index = Math.floor(float)
        const percentage = percentages[index]
        entity.speed = speed || speed === 0 ? speed : Math.random() * entity.maxSpeed * percentage
        entity.y = y || y === 0 ? y : Math.random() * (city.height - entity.height - 77)
      }
      if (type === 'character') {
        entity.y = city.height - 168
        entity.speed = speed || speed === 0 ? speed : Math.random() * entity.maxSpeed
      }
      return entity
    },

    exitVehicle: (_entities, character) => {
      const {id: characterId, drivingId, passengingId} = character
      const vehicleId = drivingId || passengingId
      const vehicle = _entities[vehicleId]
      character.drivingId = null
      character.passengingId = null
      if (passengingId) return exitVehicleAsPassenger(characterId, vehicle) && _entities
      vehicle.driverId = null
      vehicle.isSlowing = true
      vehicle.isDescending = true
      return _entities
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

    updateLocation: function (entity) {
      const {state} = this
      const {_entities} = state
      const {id, drivingId, passengingId, occupyingId, type, isSlowing, isDescending} = entity
      if (!id) return
      if (drivingId || passengingId) return entityKit.updateTravelingCharacterLocation(entity, _entities)
      if (occupyingId) return entityKit.updateOccupyingCharacterLocation(entity)
      if (type === 'character') return entityKit.updateWalkingCharacterLocation(entity, state)
      if (type !== 'vehicle') return
      if (isDescending) entityKit.descendVehicle(entity)
      if (isSlowing) entityKit.slowDownVehicle(entity)
      entityKit.updateVehicleLocation(entity, state)
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

    updateWalkingCharacterLocation: (character, state) => {
      const {city} = state
      const {speed, direction, width, playerId, x} = character
      const maxX = city.width - width
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

    updateVehicleLocation: (vehicle, state) => {
      const {city, _entities} = state
      const {speed, direction, width, height, driverId, x, y} = vehicle
      const character = driverId && _entities[driverId]
      const {playerId} = character || {}
      const distance = Math.sqrt(speed ** 2 * 2)
      const maxX = city.width - width
      const maxY = city.height - height - 77
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
        x_ <= 0 && entityKit.stopVehicle(vehicle) && (vehicle.x = 0)
        x_ >= maxX && entityKit.stopVehicle(vehicle) && (vehicle.x = maxX)
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
