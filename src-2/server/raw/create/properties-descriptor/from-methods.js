module.exports = function createPropertiesDescriptorFromMethods(
  args, existingDescriptor
) {

  const {exposure, breadth, rootEntityType, district, $, _} = args

  let path = './' + exposure + '/create/methods/' + breadth
  if (exposure === 'buffered') path += '/' + rootEntityType
  const propertiesDescriptor = Object
    .entries($(path)(exposure === 'raw' ? args : district))

    .filter(method => {
      return existingDescriptor
        ? $(_ + 'filter/duplicate-method-names')(method[0], existingDescriptor)
        : true
    })

    .reduce((propertiesDescriptor, method) => {
      const methodName = method[0]
      method = method[1]
      return {
        ...propertiesDescriptor,
        [methodName]: {value: method, enumerable: true}
      }
    }, {})

  return propertiesDescriptor
}
