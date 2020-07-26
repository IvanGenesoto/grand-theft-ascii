import {stopVehicle} from '..'

export const updateVehicleLocation = function (vehicle) {

  const {state} = this
  const {city, characters} = state
  const {speed, direction, width, height, driverId, x, y} = vehicle
  const character = driverId && characters[driverId]
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
    x_ <= 0 && stopVehicle(vehicle) && (vehicle.x = 0)
    x_ >= maxX && stopVehicle(vehicle) && (vehicle.x = maxX)
    y_ < 0 && (vehicle.y = 0)
    y_ > maxY && (vehicle.y = maxY)
    return vehicle
  }

  x_ < 0 && (vehicle.x = 0)
  x_ > maxX && (vehicle.x = maxX)
  y_ < 0 && (vehicle.y = 0)
  y_ > maxY && (vehicle.y = maxY)

  if (x_ >= 0 && x_ <= maxX && y_ >= 0 && y_ <= maxY) return vehicle

  const {length: directionCount} = directions
  const float = Math.random() * directionCount
  const index = Math.floor(float)

  vehicle.direction = directions[index]

  return vehicle
}
