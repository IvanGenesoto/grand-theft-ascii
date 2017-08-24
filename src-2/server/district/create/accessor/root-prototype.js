module.exports = function createRootAccessorPrototype(args) {

  const $ = require

  args.root = true
  args.specific = false
  const broadMethodsDescriptor = $('../property-descriptor/from-methods')(args)

  args.specific = true
  const specificMethodsDescriptor = $('../property-descriptor/from-methods')(
    {args, broadMethodsDescriptor}
  )

  const propertiesDescriptor = {...broadMethodsDescriptor, ...specificMethodsDescriptor}

  const rootAccessorPrototype = Object.create(null, propertiesDescriptor)

  return rootAccessorPrototype
}
