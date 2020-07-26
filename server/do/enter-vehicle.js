import {isVehicleEnterable} from '..'

export const enterVehicleIfCan = (state, walker) => {
  const {vehicles} = state
  const vehicle = vehicles.find(isVehicleEnterable, {walker, state})
  if (!vehicle) return vehicles
  enterVehicle(vehicle, walker)
  return vehicles
}

export const enterVehicle = (vehicle, character) => {
  const {id: characterId} = character
  const {id: vehicleId, driverId, passengerIds} = vehicle
  driverId || (vehicle.driverId = characterId)
  if (!driverId) return (character.drivingId = vehicleId) && {vehicle, character}
  character.passengingId = vehicleId
  passengerIds.push(characterId)
  return {vehicle, character}
}
