module.exports = function createRootAccessorPrototype(args) {

  const {$, _} = args
  args.breadth = 'root'

  args.exposure = 'raw'
  const rootAccessorPrototype = Object.create(null)
  args.rootAccessorPrototype = rootAccessorPrototype
  const universalMethodsDescriptor = $(_ + 'create/properties-descriptor/from-methods')(args)

  args.exposure = 'buffered'
  const specificMethodsDescriptor = $(_ + 'create/properties-descriptor/from-methods')(
    args, universalMethodsDescriptor
  )

  const propertiesDescriptor = {...universalMethodsDescriptor, ...specificMethodsDescriptor}

  Object.defineProperties(rootAccessorPrototype, propertiesDescriptor)

  return rootAccessorPrototype
}
