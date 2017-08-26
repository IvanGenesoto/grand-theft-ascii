module.exports = function createEntityAccessor(args) {
  const {id, entityAccessorPrototype, rootAccessorPrototype} = args
  const propertiesDescriptor = {id: {value: id}}
  rootAccessorPrototype[id] = Object.create(entityAccessorPrototype, propertiesDescriptor)
  const entityAccessor = rootAccessorPrototype[id]
  return Object.freeze(entityAccessor)
}
