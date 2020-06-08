export const createElements = function (component) {
  const {tag, sections, variations} = component
  tag && createElement.call(this, component)
  sections && sections.map(createElements.bind(this))
  variations && variations.map(createElements.bind(this))
}

export const createElement = function (component) {
  const {state} = this
  const {$city, camera} = state
  const {tag, elementId, src, width, height} = component
  if (!elementId) return
  const $element = document.createElement(tag)
  $element.id = elementId
  $city.appendChild($element)
  component === camera || $element.classList.add('hidden')
  width && ($element.width = width)
  height && ($element.height = height)
  if (!src) return state
  ++state.imagesTotal
  $element.src = src
  $element.onload = () => ++state.imagesLoaded
  return state
}
