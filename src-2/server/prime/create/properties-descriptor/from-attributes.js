module.exports = function createPropertiesDescriptorFromAttributes(
  {_entities, indexesByID, $}
) {

  const propertiesDescriptor = Object
    .keys(_entities)

    .reduce((propertiesDescriptor, attributeName) => {
      const attribute = _entities[attributeName]
      const propertyDescriptor = $('../../create/property-descriptor')(
        {attribute, attributeName, indexesByID}
      )
      Object.create(null, {...propertiesDescriptor, [attributeName]: {value: propertyDescriptor}})
    })

  return propertiesDescriptor
}
