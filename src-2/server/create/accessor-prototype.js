module.exports = function createAccessorPrototype(_entities, entities) {
  const $ = require
  let accessorPrototype = Object.create(null)
  accessorPrototype.standinArray = []
  const standinArray = accessorPrototype.standinArray
  const attributeNames = Object.keys(_entities)
  attributeNames.forEach(attributeName => {
    const args = [standinArray, attributeName, _entities, entities]
    accessorPrototype = $('../define/property')(accessorPrototype, ...args)
  })
  return accessorPrototype
}
