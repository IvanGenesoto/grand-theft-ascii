module.exports = function createAccessorPrototype(_entities) {
  const $ = require
  const attributeDescriptors = $('../create/property-descriptors/from-attributes')(_entities)
  const methodDescriptors = $('../create/property-descriptors/from-methods')(_entities)
  const propertiesDescriptor = {...attributeDescriptors.concat(methodDescriptors)}
  const accessorPrototype = Object.create(null, propertiesDescriptor)
  return accessorPrototype
}
