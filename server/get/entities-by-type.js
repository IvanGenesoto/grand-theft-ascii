export const getEntitiesByType = (tick, characters, vehicles, now) => {

  const entitiesByType = {characters, vehicles}
  const [mayor] = characters

  mayor.timestamp = now()
  mayor.tick = tick

  return entitiesByType
}
