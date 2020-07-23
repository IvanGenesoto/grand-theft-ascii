export const interpolateProperty = (propertyName, entityId, state, isVehicle) => {

  const {ratio, player, entitiesByType, oldEntitiesByType} = state
  const {characterId} = player
  const {characters, vehicles} = entitiesByType
  const {characters: oldCharacters, vehicles: oldVehicles} = oldEntitiesByType
  const entities = isVehicle ? vehicles : characters
  const oldEntities = isVehicle ? oldVehicles : oldCharacters
  const entity = entities[entityId]
  const oldEntity = oldEntities[entityId]

  if (!oldEntity || !entity) return 0

  const oldValue = oldEntity[propertyName]
  const value = entity[propertyName]

  if (!isVehicle && entityId === characterId && propertyName === 'x') return value

  const difference = value - oldValue

  return oldValue + difference * ratio
}
