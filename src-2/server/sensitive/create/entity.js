module.exports = function createEntity(id, _entities) {

  const index = _entities.index.length
  _entities.id[index] = id

  const attributes = Object.values(_entities)
  attributes.forEach(attribute => {
    const defaultValue = attribute[0]
    if (Array.isArray(defaultValue)) {
      attribute[index] = Array.isArray(defaultValue[0])
        ? defaultValue
        : []
    }
    else if (typeof defaultValue !== 'object') attribute[index] = defaultValue
    else throw new Error('Object or null found in default entity')
  })

  return _entities
}
