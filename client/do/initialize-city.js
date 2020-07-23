import {createElements} from '../create'
import {checkImagesLoaded} from '.'

export const initializeCity = function (city) {

  const {state} = this
  const {backgroundLayers, foregroundLayers} = city

  state.city = city
  backgroundLayers.forEach(createElements.bind({state}))
  foregroundLayers.forEach(createElements.bind({state}))
  checkImagesLoaded.call(this)
}
