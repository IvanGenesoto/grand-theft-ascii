import {vehiclePrototype, createInstance} from '..'

export const createVehicle = (state, x, y, speed) => {
  const {vehicles, city} = state
  const vehicle = createInstance(vehiclePrototype)
  const id = vehicle.id = vehicles.length
  vehicle.elementId = 'vehicle-' + id
  vehicles.push(vehicle)
  const float = Math.random() * directions.length
  const index = Math.floor(float)
  vehicle.direction = directions[index]
  vehicle.x = x || x === 0 ? x : Math.random() * (city.width - vehicle.width)
  const float_ = Math.random() * percentages.length
  const index_ = Math.floor(float_)
  const percentage = percentages[index_]
  vehicle.speed = speed || speed === 0 ? speed : Math.random() * vehicle.maxSpeed * percentage
  vehicle.y = y || y === 0 ? y : Math.random() * (city.height - vehicle.height - 77)
  return vehicle
}

const directions = [
  'left', 'right', 'up', 'down', 'up-left', 'up-right', 'down-left', 'down-right'
]

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
