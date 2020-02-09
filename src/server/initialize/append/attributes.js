module.exports = function appendAttributes(_entityRoot, _attributes) {

  const _attributeEntries = Object.entries(_attributes)

  return _attributeEntries.reduce(append, _entityRoot || Object.create(null))

  function append(_entityRoot, [attributeName, _attribute]) {
    if (!_entityRoot[attributeName]) _entityRoot[attributeName] = _attribute // #debug: Same array could be assigned to more than one district if multiple are created in a session.
    return _entityRoot
  }
}
