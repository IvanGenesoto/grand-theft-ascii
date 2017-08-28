module.exports = function createDefaultEntities(rootEntityType, $, _) {

  let _entities = Object.create(null)

  _entities = Object
    .entries($(_ + 'filter/duplicate-attribute-names')($(_ + 'attributes/' + rootEntityType)))

    .reduce((_entities, _attribute) => {
      const attributeName = _attribute[0]
      _attribute = _attribute[1]
      _entities[attributeName] = _attribute
      return _entities
    }, _entities)

  return _entities
}
