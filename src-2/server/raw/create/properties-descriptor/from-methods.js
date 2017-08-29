module.exports = function createPropertiesDescriptorFromMethods(
  args, existingDescriptor
) {

  const {exposure, breadth, rootEntityType, district, $, _} = args

  let path = './' + exposure + '/create/methods/' + breadth
  if (exposure === 'buffered') path += '/' + rootEntityType
  args = exposure === 'raw' ? args : district

  const propertiesDescriptor = Object
    .entries(
      $(path)(args)
    )

    .filter(method => {
      return existingDescriptor
        ? $(_ + 'filter/duplicate-method-names')(method[0], existingDescriptor)
        : true
    })

    .reduce((propertiesDescriptor, method) => {
      let methodName = method[0]
      method = method[1]
      const changed = $(_ + 'change-accessor-name')(methodName)
      methodName = changed ? changed.methodName : methodName
      const key = changed ? changed.key : 'value'
      return {
        ...propertiesDescriptor,
        [methodName]: {[key]: method, enumerable: true}
      }
    }, {})

  return propertiesDescriptor
}
