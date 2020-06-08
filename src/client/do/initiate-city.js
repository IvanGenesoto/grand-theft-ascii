import {drawBlueprints, shiftEntitiesBuffer} from '.'

export const initiateCity = state => {
  const {city} = state
  const {backgroundLayers, foregroundLayers} = city
  backgroundLayers.forEach(drawBlueprints)
  foregroundLayers.forEach(drawBlueprints)
  shiftEntitiesBuffer(state, true)
}
