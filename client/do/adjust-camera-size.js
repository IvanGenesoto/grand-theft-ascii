export const adjustCameraSize = function () {

  const {state} = this
  const {camera} = state
  const {style: style_, maxWidth, maxHeight, elementId} = camera
  const horizontalMargin = (innerWidth - maxWidth) / 2 + 'px'
  const verticalMargin = (innerHeight - maxHeight) / 2 + 'px'
  const $camera = document.getElementById(elementId)
  const {style} = $camera || {}

  if (innerWidth < maxWidth) {
    camera.width = innerWidth
    style_.marginLeft = 0
    style_.marginRight = 0
    $camera && ($camera.width = innerWidth)
    $camera && (style.marginLeft = 0)
    $camera && (style.marginRight = 0)
  }

  else {
    camera.width = maxWidth
    style_.marginLeft = horizontalMargin
    style_.marginRight = horizontalMargin
    $camera && ($camera.width = maxWidth)
    $camera && (style.marginLeft = horizontalMargin)
    $camera && (style.marginRight = horizontalMargin)
  }

  if (innerHeight < maxHeight) {
    camera.height = innerHeight
    style_.marginTop = 0
    style_.marginBottom = 0
    $camera && ($camera.height = innerHeight)
    $camera && (style.marginTop = 0)
    $camera && (style.marginBottom = 0)
  }

  else {
    camera.height = maxHeight
    style_.marginTop = verticalMargin
    style_.marginBottom = verticalMargin
    $camera && ($camera.height = maxHeight)
    $camera && (style.marginTop = verticalMargin)
    $camera && (style.marginBottom = verticalMargin)
  }

  return state
}
