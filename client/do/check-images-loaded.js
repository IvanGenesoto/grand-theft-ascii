import {initiateCity} from '..'

export const checkImagesLoaded = function () {

  const {state} = this
  const {timeoutId, imagesLoaded, imagesTotal} = state

  clearTimeout(timeoutId)

  if (imagesLoaded === imagesTotal) return initiateCity(state)

  state.timeoutId = setTimeout(checkImagesLoaded.bind(this), 50)
}
