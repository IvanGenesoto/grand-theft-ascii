import {interpolateProperty} from '../do'
import {isEntityOffScreen, shouldEntityBeFlipped} from '../question'

export const renderEntity = function (entity) {
  const {state, isVehicle} = this
  const {camera} = state
  const {id: entityId, drivingId, passengingId, direction, previousDirection} = entity || {}
  if (!entityId || drivingId || passengingId) return
  const entityX = interpolateProperty('x', entityId, state, isVehicle)
  const entityY = interpolateProperty('y', entityId, state, isVehicle)
  let xInCamera = entityX - camera.x
  const yInCamera = Math.round(entityY - camera.y)
  const isOffScreen = isEntityOffScreen({xInCamera, yInCamera, entity, camera})
  if (isOffScreen) return
  const $entity = document.getElementById(entity.elementId)
  const $camera = document.getElementById(camera.elementId)
  const context = $camera.getContext('2d')
  const shouldFlip = shouldEntityBeFlipped(direction, previousDirection)
  shouldFlip && context.scale(-1, 1)
  shouldFlip && (xInCamera = -entityX + camera.x - entity.width)
  xInCamera = Math.round(xInCamera)
  context.drawImage($entity, xInCamera, yInCamera)
  context.setTransform(1, 0, 0, 1, 0, 0)
}
