import {interpolateProperty} from '../do'

export const renderLayer = function (layer) {

  const {state} = this
  const {camera, entitiesByType, city, player} = state
  const {characters, vehicles} = entitiesByType
  const {characterId} = player
  const character = characters[characterId]
  const {drivingId, passengingId} = character
  const vehicleId = drivingId || passengingId
  const entity = vehicleId ? vehicles[vehicleId] : character
  const entityId = vehicleId || characterId
  const entityX = interpolateProperty('x', entityId, state, vehicleId)
  const $layer = document.getElementById(layer.elementId)
  const $camera = document.getElementById(camera.elementId)
  const context = $camera.getContext('2d')
  const layerX = layer.x || 0
  const cameraX = Math.round((entityX + entity.width / 2) / layer.depth - camera.width / 2 / layer.depth - layerX)
  const maxX = Math.round(city.width / layer.depth - camera.width / layer.depth - layerX)

  const cameraX_ =
      cameraX > maxX ? maxX
    : !layer.x && cameraX < 0 ? 0
    : cameraX

  context.drawImage(
    $layer,
    cameraX_,
    camera.y,
    camera.width,
    camera.height,
    0,
    0,
    camera.width,
    camera.height
  )
}
