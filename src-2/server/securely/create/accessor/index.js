module.exports = function createAccessor(...args) {
  const [index, accessorPrototype, rootAccessorPrototype] = args
  const propertiesDescriptor = {index: {value: index}}
  rootAccessorPrototype[index] = Object.create(accessorPrototype, propertiesDescriptor)
  const accessor = rootAccessorPrototype[index]
  return Object.freeze(accessor)
}
