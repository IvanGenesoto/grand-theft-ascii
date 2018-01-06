module.exports = function createEntityAccessorPrototype(args) {

  const {_entities, rootEntityType, district, $, _} = args

  const entityType = $(_ + 'create/entity-type')(rootEntityType)
  let entityAccessorPrototype = $(_ + 'append/accessors/attribute')({entityType, ...args})

  const initializedMethods = $(_ + 'create/methods/entity')(args)
  const initiatedMethods = $('./initiate/create-methods/entity/' + entityType)(district)

  $(_ + 'filter/duplicate-property-names')(_entities, initializedMethods, initiatedMethods)
  entityAccessorPrototype = $(_ + 'append/methods')(
    entityAccessorPrototype, initializedMethods, initiatedMethods
  )

  return Object.freeze(entityAccessorPrototype)
}
