import {getNewDirection} from '../get'
import {isVehicleDecelerating, isVehicleTurning, isVehicleStrafing} from '../is'

export const drive = function (character) {

  const {state} = this
  const {_players, _vehicles} = state
  const {playerId, drivingId: vehicleId} = character
  const player = _players[playerId]
  const {input} = player
  const vehicle = _vehicles[vehicleId]
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

  return state
}
