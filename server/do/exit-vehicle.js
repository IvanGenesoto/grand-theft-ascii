export const exitVehicle = (state, character) => {
  const {_vehicles} = state
  const {id: characterId, drivingId, passengingId} = character
  const vehicleId = drivingId || passengingId
  const vehicle = _vehicles[vehicleId]
  character.drivingId = null
  character.passengingId = null
  if (passengingId) return exitVehicleAsPassenger(characterId, vehicle) && state
  vehicle.driverId = null
  vehicle.isSlowing = true
  vehicle.isDescending = true
  return state
}

export const exitVehicleAsPassenger = (characterId, vehicle) => {
  const {passengerIds} = vehicle
  const index = passengerIds.indexOf(characterId)
  index + 1 && passengerIds.splice(index, 1)
  return vehicle
}
