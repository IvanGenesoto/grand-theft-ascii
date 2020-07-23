export const getEntitiesByType = (tick, _characters, _vehicles, now) => {

  const entitiesByType = {characters: _characters, vehicles: _vehicles}
  const [mayor] = _characters

  mayor.timestamp = now()
  mayor.tick = tick

  return entitiesByType
}
