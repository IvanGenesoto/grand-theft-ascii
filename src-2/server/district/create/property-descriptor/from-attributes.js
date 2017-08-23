module.exports = function createPropertyDescriptorsFromAttributes(
  _entities, indexesByID
) {
  const $ = require
  const attributeNames = Object.keys(_entities)
  const propertyDescriptors = attributeNames.map(attributeName => {
    return $('../create/property-descriptor')(
      attributeName, _entities, indexesByID
    )
  })
  return propertyDescriptors
}
