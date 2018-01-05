module.exports = function createEntityAccessorPrototype(args) {

  const {_entities, rootEntityType, district, indexesByID, $, _} = args

  const entityType = $(_ + 'create/entity-type')(rootEntityType)

  const entityAccessorPrototype = Object
    .entries(_entities)
    .reduce((entityAccessorPrototype, [attributeName, _attribute]) => {
      if (attributeName === 'id') return entityAccessorPrototype
      const [_defaultValue] = _attribute
      const attributeType = Array.isArray(_defaultValue) ? 'array' : 'primitive'
      const args = {_defaultValue, _attribute, attributeName, entityType, indexesByID, $, _}
      const attributeMethod = $(_ + 'create/methods/entity/' + attributeType)(args)
      const propertyDescriptor = Object.getOwnPropertyDescriptor(attributeMethod, attributeName)
      Object.defineProperty(entityAccessorPrototype, attributeName, propertyDescriptor)
      return entityAccessorPrototype
    }, Object.create(null))

  const initializedMethods = $(_ + 'create/methods/entity')(args)
  const initiatedMethods = $('./initiate/create-methods/entity/' + entityType)(district)

  $(_ + 'filter/duplicate-property-names')(_entities, initializedMethods, initiatedMethods)
  $(_ + 'append/methods')(entityAccessorPrototype, initializedMethods, initiatedMethods)

  return Object.freeze(entityAccessorPrototype)
}
