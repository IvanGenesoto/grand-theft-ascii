module.exports = function createEntity(_entities) {
  const index = _entities.entityType.length
  const attributes = Object.values(_entities)
  attributes.forEach(attribute => {
    const defaultValue = attribute[0]
    if (Array.isArray(defaultValue)) {
      if (Array.isArray(defaultValue[0])) attribute[index] = defaultValue
      else attribute[index] = []
    }
    else if (typeof defaultValue !== 'object') attribute[index] = defaultValue
    else throw console.log('Object or null found in default entity')
  })
  return index
}
