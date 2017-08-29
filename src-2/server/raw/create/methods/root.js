module.exports = function createUniversalRootMethods(
  {
    _entities,
    indexesByID,
    rootEntityType,
    districtID,
    getNextID,
    entityAccessorPrototype,
    rootAccessorPrototype,
    $,
    _
  }
) {

  const universalRootMethods = {

    districtID,

    entityType: rootEntityType,

    getLength() { // getter
      return _entities.id.length - 1 // disclude default entity
    },

    create() {
      const id = getNextID.call(universalRootMethods)
      const index = $(_ + 'create/entity')(id, _entities)
      indexesByID[id] = index
      const accessor = $(_ + 'create/accessor/entity')(
        id, entityAccessorPrototype, rootAccessorPrototype
      )
      return accessor
    },

    createMultiple(quantity) {
      const entities = []
      while (quantity) {
        const entity = universalRootMethods.create()
        entities.push(entity)
        quantity--
      }
      return entities
    }
  }

  return universalRootMethods
}
