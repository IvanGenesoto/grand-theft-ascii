module.exports = function createPropertiesDescriptorFromMethods(argsObject) {

  const $ = require
  let {args, ...descriptors} = argsObject
  args = args || argsObject
  const {specific, rootEntityType, district, individualAccessorPrototype} = args

  const accessorLevel = individualAccessorPrototype ? 'root' : 'individual'
  args = specific ? district : args
  const path = specific
      ? '../../../methods/' + accessorLevel + '/' + rootEntityType
      : '../broad-methods/' + accessorLevel

  let propertiesDescriptor = Object.creat(null)
  propertiesDescriptor = Object.entries($(path))(args)
    .filter(method => $('../../filter/method-names')(method, [...descriptors]))
    .reduce((propertiesDescriptor, method) => (
      propertiesDescriptor = {
        ...propertiesDescriptor,
        [method[0]]: {
          value: method[1]
        }
      }
    ))

  return propertiesDescriptor
}
