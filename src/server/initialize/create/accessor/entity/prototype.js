module.exports = function createEntityAccessorPrototype(args) {

  const {_entityRoot, entityRootType, districtAccessor, $} = args

  const entityType = $('./create/entity-type')(entityRootType)
  let entityAccessorPrototype = Object.create(null)
  entityAccessorPrototype = $('./append/accessors/attribute')({
    entityAccessorPrototype, entityType, ...args
  })

  const initializedMethods = $('./create/methods/entity')(args)
  const initiatedMethods = $('../initiate/create-methods/entity/' + entityType)(districtAccessor)

  $('./filter/duplicate-property-names')(_entityRoot, initializedMethods, initiatedMethods)

  entityAccessorPrototype = $('./append/methods')(
    entityAccessorPrototype, initializedMethods, initiatedMethods
  )

  return Object.freeze(entityAccessorPrototype)
}
