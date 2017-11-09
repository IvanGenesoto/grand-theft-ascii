module.exports = function createRootAccessorPrototype(args) {

  let {_entities, rootEntityType, district, $, _} = args

  _entities = $(_ + 'add/attributes')(_entities, rootEntityType, $, _)

  const indexesByID = $(_ + 'create/indexes-by-id')(_entities, rootEntityType)

  const entityAccessorPrototype = $(_ + 'create/accessor/entity/prototype')(
    {...args, _entities, indexesByID}
  )

  const rootAccessorPrototype = Object.create(entityAccessorPrototype)

  const initiatedMethods = $('./initiate/create-methods/root/' + rootEntityType)(district)
  const initializedMethods = $(_ + 'create/methods/root')(
    {...args, _entities, indexesByID, entityAccessorPrototype, rootAccessorPrototype}
  )

  $(_ + 'filter/duplicate-property-names')(initializedMethods, initiatedMethods)
  $(_ + 'filter/integer-property-names')(initializedMethods, initiatedMethods)
  $(_ + 'append/methods')(rootAccessorPrototype, initializedMethods, initiatedMethods)

  _entities.id.forEach((id, index) => {
    if (id) {
      indexesByID[id] = index
      const entityAccessor = $(_ + 'create/accessor/entity')(id, entityAccessorPrototype)
      rootAccessorPrototype[id] = entityAccessor
    }
  })

  return rootAccessorPrototype
}
