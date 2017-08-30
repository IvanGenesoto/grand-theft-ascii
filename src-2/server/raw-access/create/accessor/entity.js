module.exports = function createEntityAccessor(
  id, entityAccessorPrototype, rootAccessorPrototype
) {

  const propertiesDescriptor = {id: {value: id, enumerable: true}}
  rootAccessorPrototype[id] = Object.create(entityAccessorPrototype, propertiesDescriptor)
  const entityAccessor = rootAccessorPrototype[id]
  return Object.freeze(entityAccessor)
}
