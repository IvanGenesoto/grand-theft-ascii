module.exports = function createEntity(id, _entities) {

  const index = _entities.id.length
  _entities.id[index] = id

  const _attributes = Object.values(_entities)
  _attributes.forEach(_attribute => {
    const defaultValue = _attribute[0]
    _attribute[index] = Array.isArray(defaultValue)
      ? []
      : defaultValue
  })

  return index
}
