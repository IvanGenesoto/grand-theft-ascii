Object.values = require('object.values')

module.exports = function createEntity(_entities) {
  const index = _entities.status.length
  const attributes = Object.values(_entities)
  attributes.forEach(attribute => {
    const defaultValue = attribute[0]
    if (Array.isArray(defaultValue)) attribute[index] = createArrayAttribute(defaultValue)
    else if (typeof defaultValue !== 'object') attribute[index] = defaultValue
    else throw console.log('Object or null found in default entity')
  })
  return index
}

function createArrayAttribute(defaultArray) {
  if (Array.isArray(defaultArray[0])) return defaultArray
  else return []
}
