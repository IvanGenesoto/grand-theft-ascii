module.exports = function appendAttributes(_entityRoot, _attributes) {

  const _attributeEntries = Object.entries(_attributes)

  return _attributeEntries.reduce(append, _entityRoot || Object.create(null))

  function append(_entityRoot, [attributeName, _attribute]) {
    if (!_entityRoot[attributeName]) _entityRoot[attributeName] = _attribute
    return _entityRoot
  }
}
