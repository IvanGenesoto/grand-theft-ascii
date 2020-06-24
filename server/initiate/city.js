import {createCity, createCharacter, createVehicle, createMayor} from '../create'

export const initiateCity = state => {
  let {characterCount, vehicleCount} = state
  state.city = createCity(state)
  createMayor(state)
  while (characterCount) createCharacter(state) && --characterCount
  while (vehicleCount) createVehicle(state) && --vehicleCount
  return state
}
