module.exports = function defineDefaultProperty(...args) {
  const [accessorPrototype, attributeName, _entities, entitiesPrototype] = args
  const $ = require
  const args_ = [attributeName, _entities, entitiesPrototype]
  const descriptor = $('../create/default-descriptor')(...args_)
  return Object.defineProperty(accessorPrototype, attributeName, descriptor)
}
