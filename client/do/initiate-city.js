import {drawBlueprints, shiftEntitiesBuffer} from '..'

export const initiateCity = state => {

  const {city} = state
  const {backgroundLayers, foregroundLayers} = city
  const $loading = document.getElementById('loading')

  $loading.classList.add('hidden')
  backgroundLayers.forEach(drawBlueprints)
  foregroundLayers.forEach(drawBlueprints)
  shiftEntitiesBuffer(state, true)
}
