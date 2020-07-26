import {interpolateProperty} from '..'

export const updateCamera = state => {

  const {city, camera, entitiesByType, player} = state
  const {characters, vehicles} = entitiesByType
  const {characterId} = player
  const character = characters[characterId]
  const {drivingId, passengingId} = character
  const vehicleId = drivingId || passengingId
  const entity = vehicleId ? vehicles[vehicleId] : character
  const entityId = vehicleId || characterId
  const entityX = interpolateProperty('x', entityId, state, vehicleId)
  const entityY = interpolateProperty('y', entityId, state, vehicleId)
  const cameraX = camera.x = Math.round(entityX + entity.width / 2 - camera.width / 2)
  const cameraY = camera.y = Math.round(entityY + entity.height / 2 - camera.height / 2)
  const maxX = city.width - camera.width
  const maxY = city.height - camera.height

  cameraX < 0 && (camera.x = 0)
  cameraX > maxX && (camera.x = maxX)
  cameraY < 0 && (camera.y = 0)
  cameraY > maxY && (camera.y = maxY)

  return state
}
