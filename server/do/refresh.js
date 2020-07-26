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

  const {_players, _characters, _vehicles, vehicleKits, now, io} = state
  const tick = ++state.tick

  state.refreshingStartTime = now()
  handleQueues.call({state})

  const latencyKits = _players.map(getLatencyKits, {_players})
  const vehicleKit = _vehicles.reduce(pushAttributes, {xs: [], ys: [], timestamp: now()})

  latencyKits.reduce(updateLatencies, _characters)
  vehicleKits.push(vehicleKit)
  vehicleKits.length > 60 && vehicleKits.shift()

  const playerCharacters = _players.map(({characterId}) => _characters[characterId])
  const {actives} = playerCharacters.reduce(pushIfActive, {_players, actives: []})
  const activesByCategory = {walkers: [], drivers: [], passengers: []}
  const {walkers, drivers, passengers} = actives.reduce(categorize, activesByCategory)

  walkers.reduce(enterVehicleIfCan, state)
  passengers.reduce(exitVehicle, state)
  drivers.reduce(exitVehicle, state)

  const charactersByCategory = {walkers: [], drivers: [], passengers: []}
  const args = [categorize, charactersByCategory]
  const {walkers: walkers_, drivers: drivers_} = playerCharacters.reduce(...args)

  walkers_.forEach(walk, {_players})
  drivers_.forEach(drive, {state})
  _characters.forEach(updateCharacterLocation, {state})
  _vehicles.forEach(updateVehicleBehavior)
  _vehicles.forEach(updateVehicleLocation, {state})

  if (tick % 3) return deferRefresh(state)

  const entitiesByType = getEntitiesByType(tick, _characters, _vehicles, now)

  io.volatile.emit('entities', entitiesByType)
  deferRefresh(state)

  return state
}
