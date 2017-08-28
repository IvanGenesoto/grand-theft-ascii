module.exports = function createIndividualAccessorPrototype(args) {

  const {$, _} = args
  args.breadth = 'individual'

  const attributesDescriptor = $(_ + 'create/properties-descriptor/from-attributes')(args)

  args.exposure = 'buffered'
  const specificMethodsDescriptor = $(_ + 'create/properties-descriptor/from-methods')(
    args, attributesDescriptor
  )

  const propertiesDescriptor = {
    ...attributesDescriptor,
    ...specificMethodsDescriptor
  }

  const entityAccessorPrototype = Object.create(null, propertiesDescriptor)

  return Object.freeze(entityAccessorPrototype)
}
