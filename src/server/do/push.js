export const pushAttributes = (vehicleKit, vehicle) => {
  const {xs, ys} = vehicleKit
  const {x, y} = vehicle
  xs.push(x)
  ys.push(y)
  return vehicleKit
}

export const pushIfActive = (activeKit, character, index) => {
  const {_players, actives} = activeKit
  const player = _players[index]
  const {input, previousAction} = player
  const {action} = input
  const isActive = action && !previousAction
  player.previousAction = action
  isActive && actives.push(character)
  return activeKit
}
