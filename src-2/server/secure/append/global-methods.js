module.exports = function appendMethods(entity) {
  const $ = require
  const entityType = entity[0]
  entity = entity[1]
  const methods = Object.entries($('../../entities/global-methods/' + entityType)())
  methods.forEach(method => {
    const methodName = method[0]
    method = method[1]
    entity[methodName] = method
    Object.freeze(entity)
  })
}
