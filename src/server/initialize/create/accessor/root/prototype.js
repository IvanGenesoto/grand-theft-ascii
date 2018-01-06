module.exports = function createRootAccessorPrototype(args) {

  let {_entityRoot, entityRootType, districtAccessor, $} = args

  const _attributes = $('./attributes/' + entityRootType)
  _entityRoot = $('./append/attributes')(_entityRoot, _attributes)

  const indexesByID = $('./create/indexes-by-id')(_entityRoot, entityRootType)
  let rootAccessorPrototype = Object.create(null)
  const entityAccessorPrototype = $('./create/accessor/entity/prototype')(
    {...args, _entityRoot, indexesByID}
  )

  const initiatedMethods = $('../initiate/create-methods/root/' + entityRootType)(districtAccessor)
  const initializedMethods = $('./create/methods/root')(
    {...args, _entityRoot, indexesByID, entityAccessorPrototype, rootAccessorPrototype}
  )

  $('./filter/duplicate-property-names')(initializedMethods, initiatedMethods)
  $('./filter/integer-property-names')(initializedMethods, initiatedMethods)
  rootAccessorPrototype = $('./append/methods')(
    rootAccessorPrototype, initializedMethods, initiatedMethods
  )

  const createEntityAccessor = $('./create/accessor/entity')
  rootAccessorPrototype = $('./append/accessors/entity')({
    _entityRoot, rootAccessorPrototype, entityAccessorPrototype, createEntityAccessor
  })

  return rootAccessorPrototype
}
