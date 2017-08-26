module.exports = function createPropertiesDescriptorFromMethods(
  args, existingDescriptor
) {

  const {common, rootEntityType, district, entityAccessorPrototype, $} = args

  args = common ? args : district
  const accessorLevel = entityAccessorPrototype ? 'root' : 'entity'
  const path = common
    ? '../../create/common-methods/root'
    : '../../../initiate/methods/' + accessorLevel + '-specific/' + rootEntityType

  const propertiesDescriptor = Object
    .entries($(path))(args)

    .filter(method => (
      existingDescriptor
        ? $('../../filter/method-names')(method[0], existingDescriptor)
        : true
    ))

    .reduce((propertiesDescriptor, method) => {
      const methodName = method[0]
      method = method[1]
      Object.create(null, {...propertiesDescriptor, [methodName]: {value: method}})
    })

  return propertiesDescriptor
}
