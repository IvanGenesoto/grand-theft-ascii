import {isVehicleEnterable} from '../is'

export const enterVehicleIfCan = (state, walker) => {
  const {_vehicles} = state
  const vehicle = _vehicles.find(isVehicleEnterable, {walker, state})
  if (!vehicle) return _vehicles
  enterVehicle(vehicle, walker)
  return _vehicles
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
