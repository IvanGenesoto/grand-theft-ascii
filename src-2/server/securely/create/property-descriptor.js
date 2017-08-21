module.exports = function defineProperty(...args) {
  const [accessorPrototype, standinArray, attributeName, _entities, entitiesPrototype] = args
  const $ = require
  const attribute = _entities[attributeName]
  const defaultValue = attribute[0]
  if (Array.isArray(defaultValue)) {
    const args = [standinArray, attributeName, _entities, entitiesPrototype]
    return $('../define/array-property')(accessorPrototype, ...args)
  }
  else if (typeof defaultValue !== 'object') {
    const args = [attributeName, _entities, entitiesPrototype]
    return $('../define/default-property')(accessorPrototype, ...args)
  }
  else throw new Error('Object or null found in default entity')
}
