import {renderLayer, renderEntity} from '..'

export const render = state => {

  const {city, entitiesByType} = state
  const {characters, vehicles} = entitiesByType
  const {backgroundLayers, foregroundLayers} = city

  backgroundLayers.forEach(renderLayer, {state})
  characters.forEach(renderEntity, {state})
  vehicles.forEach(renderEntity, {state, isVehicle: true})
  foregroundLayers.forEach(renderLayer, {state})
}
