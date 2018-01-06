module.exports = function appendAttributes(_entities, _attributes, $, _) {

  const _attributeEntries = Object.entries(_attributes)

  return _attributeEntries.reduce(append, _entities || Object.create(null))

  function append(_entities, [attributeName, _attribute]) {
    if (!_entities[attributeName]) _entities[attributeName] = _attribute
    return _entities
  }
}
