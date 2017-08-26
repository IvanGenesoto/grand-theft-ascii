module.exports = function createDefaultEntities(rootEntityType, $) {

  let _entities = Object.create(null)

  _entities = Object
    .entries($('../filter/attribute-names')($('../attributes/' + rootEntityType)))

    .reduce((_entities, attribute) => {
      _entities[attribute[0]] = attribute[1]
    })

  return _entities
}
