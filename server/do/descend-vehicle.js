export const descendVehicle = vehicle => {

  vehicle.y += 5

  if (vehicle.y < 7843) return vehicle

  vehicle.isDescending = false
  vehicle.y = 7843

  return vehicle
}
