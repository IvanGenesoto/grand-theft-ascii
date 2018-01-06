module.exports = function createRootAccessorPrototype(args) {

  let {_entities, rootEntityType, district, $, _} = args

  const _attributes = $(_ + 'attributes/' + rootEntityType)
  _entities = $(_ + 'append/attributes')(_entities, _attributes)

  const indexesByID = $(_ + 'create/indexes-by-id')(_entities, rootEntityType)
  let rootAccessorPrototype = Object.create(null)
  const entityAccessorPrototype = $(_ + 'create/accessor/entity/prototype')(
    {...args, _entities, indexesByID}
  )

  const initiatedMethods = $('./initiate/create-methods/root/' + rootEntityType)(district)
  const initializedMethods = $(_ + 'create/methods/root')(
    {...args, _entities, indexesByID, entityAccessorPrototype, rootAccessorPrototype}
  )

  $(_ + 'filter/duplicate-property-names')(initializedMethods, initiatedMethods)
  $(_ + 'filter/integer-property-names')(initializedMethods, initiatedMethods)
  rootAccessorPrototype = $(_ + 'append/methods')(
    rootAccessorPrototype, initializedMethods, initiatedMethods
  )

  const createEntityAccessor = $(_ + 'create/accessor/entity')
  rootAccessorPrototype = $(_ + 'append/accessors/entity')({
    _entities, rootAccessorPrototype, entityAccessorPrototype, createEntityAccessor
  })

  return rootAccessorPrototype
}
