import {descendVehicle, slowDownVehicle} from '../do'

export const updateVehicleBehavior = vehicle => {
  const {isSlowing, isDescending} = vehicle
  if (isDescending) descendVehicle(vehicle)
  if (isSlowing) slowDownVehicle(vehicle)
  return vehicle
}
