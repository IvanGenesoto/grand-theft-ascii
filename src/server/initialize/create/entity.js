module.exports = function createEntity(id, _entityRoot) {

  const index = _entityRoot.id.length
  _entityRoot.id[index] = id

  Object
    .values(_entityRoot)
    .forEach(_attribute => {
      const [_defaultValue] = _attribute
      _attribute[index] = Array.isArray(_defaultValue) ? [] : _defaultValue
    })

  return index
}
