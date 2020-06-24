import {getNearest} from '../get'
import {isVehicleTouchingCharacter} from '.'

export const isVehicleEnterable = function (vehicle) {
  const {walker, state} = this
  const {vehicleKits, now} = state
  const {id: vehicleId, driverId, passengerIds, seatCount, width, height} = vehicle
  const {length: passengerCount} = passengerIds
  const driverCount = driverId ? 1 : 0
  if (!vehicleId || driverCount + passengerCount >= seatCount) return false
  const {latency} = walker
  const timestamp = now() - latency
  const {index} = vehicleKits.reduce(getNearest, {timestamp, index: 0})
  const vehicleKit = vehicleKits[index]
  const {xs, ys} = vehicleKit || {}
  const x = xs && xs[vehicleId]
  const y = ys && ys[vehicleId]
  const vehicle_ = {x, y, width, height}
  return isVehicleTouchingCharacter(vehicle_, walker)
}
