module.exports = function createPropertyDescriptorsFromAttributes(_entities, entitiesPrototype) {
  const $ = require
  const standinArray = []
  const attributeNames = Object.keys(_entities)
  const propertyDescriptors = attributeNames.map(attributeName => {
    const args = [standinArray, attributeName, _entities, entitiesPrototype]
    return $('../create/property-descriptor')(...args)
  })
  return propertyDescriptors
}
