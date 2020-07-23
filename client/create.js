export const createElements = function (component) {
  const {tag, sections, variations} = component
  tag && createElement.call(this, component)
  sections && sections.map(createElements.bind(this))
  variations && variations.map(createElements.bind(this))
}

export const createElement = function (component) {
  const {state, index} = this
  const {$city, camera} = state
  const {tag, elementId, src, width, height, frames} = component
  const $element = document.createElement(tag)
  const hasIndex = index !== undefined
  const src_ = hasIndex ? frames[index] : src
  const postfix = hasIndex ? '-' + index : ''
  const callCreateElement = (unused, index) => createElement.call({state, index}, component)
  if (!elementId) return
  $element.id = elementId + postfix
  $city.appendChild($element)
  component === camera || $element.classList.add('hidden')
  width && ($element.width = width)
  height && ($element.height = height)
  if (!src_) return
  ++state.imagesTotal
  $element.src = src_
  $element.onload = () => ++state.imagesLoaded
  frames && !hasIndex && frames.forEach(callCreateElement)
  return state
}
