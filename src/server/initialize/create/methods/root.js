module.exports = function createRootMethods(
  {
    _entities,
    indexesByID,
    rootEntityType,
    district,
    districtID,
    getNextID,
    entityAccessorPrototype,
    rootAccessorPrototype,
    $,
    _
  }
) {

  const rootMethods = {

    districtID,

    entityType: rootEntityType,

    getLength() {
      return _entities.id.length - 1 // exclude default entity
    },

    create() {
      const id = getNextID.call(this)
      const index = $(_ + 'create/entity')(id, _entities)
      indexesByID[id] = index
      const entityAccessor = $(_ + 'create/accessor/entity')(id, entityAccessorPrototype)
      rootAccessorPrototype[id] = entityAccessor
      return entityAccessor
    },

    createMultiple(quantity) {
      const entities = []
      while (quantity) {
        const entity = this.create()
        entities.push(entity)
        quantity--
      }
      return entities
    }
  }

  return rootMethods
}
