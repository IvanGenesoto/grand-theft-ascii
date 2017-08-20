module.exports = function createAttributeDescriptors(_entities, entitiesPrototype) {
  const $ = require
  const standinArray = []
  const attributeNames = Object.keys(_entities)
  const attributeDescriptors = attributeNames.map(attributeName => {
    const args = [standinArray, attributeName, _entities, entitiesPrototype]
    return $('../create/property-descriptor')(...args)
  })
  return attributeDescriptors
}
