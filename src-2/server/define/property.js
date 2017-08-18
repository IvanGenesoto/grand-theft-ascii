module.exports = function defineProperty(...args) {
  const [accessorPrototype, standinArray, attributeName, _entities, entities] = args
  const $ = require
  const attribute = _entities[attributeName]
  const defaultValue = attribute[0]
  if (Array.isArray(defaultValue)) {
    const args = [accessorPrototype, standinArray, attributeName, _entities, entities]
    return $('../define/array-property')(...args)
  }
  else if (typeof defaultValue !== 'object') {
    const args = [accessorPrototype, attributeName, _entities, entities]
    return $('../define/default-property')(...args)
  }
  else throw console.log('Object or null found in default entity')
}
