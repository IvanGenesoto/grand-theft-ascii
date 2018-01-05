module.exports = function appendAttributes(_entities, rootEntityType, $, _) {

  _entities = Object
    .entries($(_ + 'attributes/' + rootEntityType))
    .reduce(
      (_entities, [attributeName, _attribute]) => {
        if (!_entities[attributeName]) _entities[attributeName] = _attribute
        return _entities
      },
      _entities || Object.create(null))

  return _entities
}
