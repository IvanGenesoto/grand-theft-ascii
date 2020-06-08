export const slowDownVehicle = vehicle => {
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
}
