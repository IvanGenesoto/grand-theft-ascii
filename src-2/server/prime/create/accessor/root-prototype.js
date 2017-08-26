module.exports = function createRootAccessorPrototype(args) {

  const {$} = args

  args.root = true
  args.shared = true
  const rootAccessorPrototype = Object.create(null)
  args.rootAccessorPrototype = rootAccessorPrototype
  const sharedRootMethodsDescriptor = $('../../create/properties-descriptor/from-methods')(args)

  args.shared = false
  const rootMethodsDescriptor = $('../../create/properties-descriptor/from-methods')(
    args, sharedRootMethodsDescriptor
  )

  const propertiesDescriptor = {...sharedRootMethodsDescriptor, ...rootMethodsDescriptor}

  Object.defineProperties(rootAccessorPrototype, propertiesDescriptor)

  return rootAccessorPrototype
}
