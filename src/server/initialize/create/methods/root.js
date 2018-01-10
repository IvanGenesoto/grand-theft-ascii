module.exports = function createRootMethods(
  {
    _entityRoot,
    indexesByID,
    entityRootType,
    district,
    districtID,
    getNextID,
    entityAccessorPrototype,
    rootAccessorPrototype,
    $,
    _
  }
) {

  return {

    districtID,

    entityType: entityRootType,

    getLength() {
      return _entityRoot.id.length - 1 // exclude default entity
    },

    create() {
      const id = getNextID.call(this)
      const index = $('./create/entity')(id, _entityRoot)
      indexesByID[id] = index
      const entityAccessor = $('./create/accessor/entity')(id, entityAccessorPrototype)
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
}
