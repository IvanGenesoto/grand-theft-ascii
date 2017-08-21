module.exports = function appendIndividualMethods(...args) {
  const $ = require
  const [accessorPrototype, entityType] = args
  const methods = Object.entries($('../../entities/individual-methods/' + entityType)())
  methods.forEach(method => {
    const methodName = method[0]
    method = method[1]
    accessorPrototype[methodName] = method
  })
  return accessorPrototype
}
