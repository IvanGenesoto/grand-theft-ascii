module.exports = function createAccessorPrototype(_entities) {
  const $ = require
  const attributeDescriptors = $('../create/attribute-descriptors')(_entities)
  const methodDescriptors = $('../create/method-descriptors')(_entities)
  const propertiesDescriptor = {...attributeDescriptors.concat(methodDescriptors)}
  const accessorPrototype = Object.create(null, propertiesDescriptor)
  return accessorPrototype
}
