export const renderElement = (tag, attributeByName, children) => {

  const $element = document.createElement(tag)

  const append = ($element, $child) => {
    $element.append($child)
    return $element
  }

  attributeByName && Object
    .entries(attributeByName)
    .forEach(([key, value]) => $element.setAttribute(key, value))

  if (!children) return $element
  if (Array.isArray(children)) return children.reduce(append, $element)

  return append($element, children)
}
