module.exports = function addAttributes(_entities, rootEntityType, $, _) {

  _entities = Object
    .entries($(_ + 'attributes/' + rootEntityType))
    .reduce((_entities, [attributeName, _attribute]) => {
      _entities[attributeName] = _attribute
      return _entities
    }, _entities || Object.create(null))

  return _entities
}
