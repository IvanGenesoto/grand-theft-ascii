module.exports = function createIndividualAccessor(args) {
  const {id, accessorPrototype, rootAccessor, propertiesDescriptor} = args
  propertiesDescriptor.id = {value: id}
  rootAccessor[id] = Object.create(accessorPrototype, propertiesDescriptor)
  const accessor = rootAccessor[id]
  return Object.freeze(accessor)
}
