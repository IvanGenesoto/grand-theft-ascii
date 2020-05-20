module.exports = function createEntity(id, _entityRoot) {

  const index = _entityRoot.id.length

  Object
    .values(_entityRoot)
    .forEach(_attribute => {
      const [_defaultValue] = _attribute
      _attribute[index] = Array.isArray(_defaultValue) ? [] : _defaultValue
    })

  _entityRoot.id[index] = id

  return index
}
