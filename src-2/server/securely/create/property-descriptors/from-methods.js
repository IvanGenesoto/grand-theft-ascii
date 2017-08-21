module.exports = function createMethodDescriptors(_entities) {
  const $ = require
  const entityType = _entities.entityType[0]
  const methods = Object.entries($('../../methods/for-individual/' + entityType)())
  const methodDescriptors = methods.map(method => {
    const methodName = method[0]
    method = method[1]
    return {[methodName]: {value: method}}
  })
  return methodDescriptors
}
