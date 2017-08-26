module.exports = function createCommonRootMethods(
  {_entities, indexesByID, rootEntityType, districtID, getNextID,
    entityAccessorPrototype, rootAccessorPrototype, $}
) {

  return {

    districtID,

    entityType: rootEntityType,

    get length() {
      return _entities.id.length
    },

    create: () => {
      const id = getNextID.call(this)
      const index = $('../../create/entity')(id, _entities)
      indexesByID[id] = index
      const accessor = $('../../create/accessor')(id, entityAccessorPrototype, rootAccessorPrototype)
      return accessor
    }
  }
}
