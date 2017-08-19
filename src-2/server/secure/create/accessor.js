module.exports = function createAccessor(...args) {
  const [index, accessorPrototype, entitiesPrototype] = args
  const propertiesDescriptor = {index: {value: index}}
  entitiesPrototype[index] = Object.create(accessorPrototype, propertiesDescriptor)
  const accessor = entitiesPrototype[index]
  return Object.freeze(accessor)
}
