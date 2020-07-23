import {renderLayer, renderEntity} from '.'

export const render = state => {
  const {city, entitiesByType} = state
  const {characters, vehicles} = entitiesByType
  const {backgroundLayers, foregroundLayers} = city
  backgroundLayers.forEach(renderLayer, {state})
  vehicles.forEach(renderEntity, {state, isVehicle: true})
  characters.forEach(renderEntity, {state})
  foregroundLayers.forEach(renderLayer, {state})
}
