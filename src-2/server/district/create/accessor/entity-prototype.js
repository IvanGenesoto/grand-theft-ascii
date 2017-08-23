module.exports = function createAccessorPrototype(args) {
  const {_entities, indexesByID, entityType, districtID, getNextID} = args // eslint-disable-line no-unused-vars
  const $ = require
  const accessorPrototype = Object.create(null)
  const attributeDescriptors = $('../create/property-descriptors/from-attributes')(
    _entities, indexesByID)
  args.accessorPrototype = accessorPrototype
  const methodDescriptors = $('../create/property-descriptors/from-methods')(args)
  const propertiesDescriptor = {...attributeDescriptors.concat(methodDescriptors)}
  Object.defineProperties(accessorPrototype, propertiesDescriptor)
  return accessorPrototype
}
