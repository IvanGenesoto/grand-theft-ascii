module.exports = function createEntityAccessorPrototype(args) {

  const {$} = args

  const attributesDescriptor = $('..properties-descriptor/from-attributes')(args)

  const methodsDescriptor = $('..properties-descriptor/from-methods')(
    args, attributesDescriptor
  )

  const propertiesDescriptor = {
    ...attributesDescriptor,
    ...methodsDescriptor
  }

  const individualAccessorPrototype = Object.create(null, propertiesDescriptor)

  return individualAccessorPrototype
}
