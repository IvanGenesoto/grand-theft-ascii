module.exports = function defineArrayProperty(...args) {
  const [accessorPrototype, standinArray, attributeName, _entities, entitiesPrototype] = args
  const $ = require
  const attribute = _entities[attributeName]
  const defaultValue = attribute[0]
  if (Array.isArray(defaultValue[0])) {
    const args = [attributeName, attribute, entitiesPrototype]
    var descriptor = $('../create/nested-array/descriptor')(...args)
  }
  else {
    const args = [attributeName, standinArray, _entities, entitiesPrototype]
    descriptor = $('../create/array-descriptor')(...args)
  }
  return Object.defineProperty(accessorPrototype, attributeName, descriptor)
}
