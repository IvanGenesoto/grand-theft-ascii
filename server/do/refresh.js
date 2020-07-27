import {
  getLatencyKits,
  getEntitiesByType,
  handleQueues,
  updateLatencies,
  updateCharacterLocation,
  updateVehicleBehavior,
  updateVehicleLocation,
  pushAttributes,
  pushIfActive,
  categorize,
  enterVehicleIfCan,
  exitVehicle,
  walk,
  drive,
  deferRefresh
} from '..'

export const refresh = state => {

  const {players, characters, vehicles, vehicleKits, now, io} = state
  const tick = ++state.tick

  state.refreshingStartTime = now()
  handleQueues.call({state})

  const latencyKits = players.map(getLatencyKits, {players})
  const vehicleKit = vehicles.reduce(pushAttributes, {xs: [], ys: [], timestamp: now()})

  latencyKits.reduce(updateLatencies, characters)
  vehicleKits.push(vehicleKit)
  vehicleKits.length > 60 && vehicleKits.shift()

  const playerCharacters = players.map(({characterId}) => characters[characterId])
  const {actives} = playerCharacters.reduce(pushIfActive, {players, actives: []})
  const activesByCategory = {walkers: [], drivers: [], passengers: []}
  const {walkers, drivers, passengers} = actives.reduce(categorize, activesByCategory)

  walkers.reduce(enterVehicleIfCan, state)
  passengers.reduce(exitVehicle, state)
  drivers.reduce(exitVehicle, state)

  const charactersByCategory = {walkers: [], drivers: [], passengers: []}
  const args = [categorize, charactersByCategory]
  const {walkers: walkers_, drivers: drivers_} = playerCharacters.reduce(...args)
  const entitiesByType = getEntitiesByType(tick, characters, vehicles, now)

  walkers_.forEach(walk, {players})
  drivers_.forEach(drive, {state})
  characters.forEach(updateCharacterLocation, {state})
  vehicles.forEach(updateVehicleBehavior)
  vehicles.forEach(updateVehicleLocation, {state})
  tick % 3 === 0 && io.emit('entities', entitiesByType)
  deferRefresh(state)

  return state
}
