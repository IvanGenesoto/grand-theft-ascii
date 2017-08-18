module.exports = function defineDefaultProperty(...args) {
  const [accessorPrototype, attributeName, _entities, entities] = args
  const $ = require
  const args_ = [attributeName, _entities, entities]
  const descriptor = $('../create/default-descriptor')(...args_)
  return Object.defineProperty(accessorPrototype, attributeName, descriptor)
}
