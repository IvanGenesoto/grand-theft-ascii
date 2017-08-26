module.exports = function createDefaultEntities(rootEntityType, $) {

  let _entities = Object.create(null)

  _entities = Object
    .entries($('../filter/attribute-names')($('../attributes/' + rootEntityType)))

    .reduce((_entities, attribute) => {
      const attributeName = attribute[0]
      attribute = attribute[1]
      _entities[attributeName] = attribute
      return _entities
    })

  return _entities
}
