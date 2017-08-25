module.exports = function createDefaultEntities(rootEntityType) {

  const $ = require

  const propertiesDescriptor = Object
    .entries($('../filter/attribute-names')($('../attributes/' + rootEntityType)))

    .reduce((propertiesDescriptor, attribute) => {
      propertiesDescriptor = {
        ...propertiesDescriptor,
        [attribute[0]]: {
          value: attribute[1],
          configurable: true,
          enumerable: true,
          writable: true
        }
      }
    })

  const _entities = Object.create(null, propertiesDescriptor)

  return _entities
}
