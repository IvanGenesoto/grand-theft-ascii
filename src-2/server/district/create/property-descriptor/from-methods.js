module.exports = function createPropertyDescriptorsFromMethods(argsObject) {

  const $ = require
  let {args, ...descriptors} = argsObject
  const {specific, entityType, district, individualAccessorPrototype} = args

  const accessorLevel = individualAccessorPrototype ? 'root' : 'individual'
  args = specific ? district : args
  const path = specific
      ? '../../../methods/' + accessorLevel + '/' + entityType + 's'
      : '../methods/' + accessorLevel

  let propertiesDescriptor = {}
  propertiesDescriptor = Object.entries($(path))(args)
    .filter(method => $('../../filter/methodNames')(method, [...descriptors]))
    .reduce((propertiesDescriptor, method) => (
      propertiesDescriptor = {...propertiesDescriptor, [method[0]]: {value: method[1]}}
    ))

  return propertiesDescriptor
}
