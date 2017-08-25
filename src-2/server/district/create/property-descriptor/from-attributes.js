module.exports = function createPropertiesDescriptorFromAttributes(
  {_entities, indexesByID}
) {

  const $ = require

  const attributeNames = Object.keys(_entities)

  const propertyDescriptors = attributeNames.map(attributeName => (
      $('../../create/property-descriptor')({attributeName, _entities, indexesByID})
    ))

  const propertiesDescriptor = Object.create(null)

  propertyDescriptors.forEach((descriptor, index) => {
    const attributeName = attributeNames[index]
    propertiesDescriptor[attributeName] = descriptor
  })

  return propertiesDescriptor
}
