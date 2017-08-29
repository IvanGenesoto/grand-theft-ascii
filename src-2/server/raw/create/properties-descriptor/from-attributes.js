module.exports = function createPropertiesDescriptorFromAttributes(args) {

  const {_entities, $, _} = args

  const propertiesDescriptor = Object
    .keys(_entities)

    .reduce((propertiesDescriptor, attributeName) => {
      const _attribute = _entities[attributeName]
      let _defaultValue = _attribute[0]
      const descriptorType = (Array.isArray(_defaultValue)) ? 'array' : 'primitive'
      const propertyDescriptor = $(
        _ + 'create/property-descriptor/' + descriptorType
      )({...args, _defaultValue, _attribute})
      return {...propertiesDescriptor, [attributeName]: propertyDescriptor}
    }, {})

  return propertiesDescriptor
}
