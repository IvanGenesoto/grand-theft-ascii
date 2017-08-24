module.exports = function createIndividualAccessorPrototype(args) {

  const $ = require

  const attributesDescriptor = $('..property-descriptor/from-attributes')(args)
  const broadMethodsDescriptor = $('..property-descriptor/from-methods')(
    {args, attributesDescriptor}
  )
  args.specific = true
  const specificMethodsDescriptor = $('..property-descriptor/from-methods')(
    {args, attributesDescriptor, broadMethodsDescriptor}
  )

  const propertiesDescriptor = {
    ...attributesDescriptor,
    ...broadMethodsDescriptor,
    ...specificMethodsDescriptor
  }

  const individualAccessorPrototype = Object.create(null, propertiesDescriptor)

  return individualAccessorPrototype
}
