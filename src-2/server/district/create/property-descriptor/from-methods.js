module.exports = function createPropertyDescriptorsFromMethods(args) {
  const $ = require
  let {type, entityType} = args
  if (entityType) entityType = '/' + entityType + 's'
  const path = type
    ? '../../../methods/for-' + type + entityType
    : '../../methods/for-accessor-prototype'
  const methods = Object.entries($(path))(args)
  const propertyDescriptors = methods.map(method => {
    const methodName = method[0]
    method = method[1]
    return {[methodName]: {value: method}}
  })
  return propertyDescriptors
}
