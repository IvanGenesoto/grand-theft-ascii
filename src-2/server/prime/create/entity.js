module.exports = function createEntity(id, _entities) {

  const index = _entities.index.length
  _entities.id[index] = id

  const attributes = Object.values(_entities)
  attributes.forEach(attribute => {
    const defaultValue = attribute[0]
    attribute[index] = Array.isArray(defaultValue)
      ? []
      : defaultValue
  })

  return index
}
