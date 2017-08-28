module.exports = function createUniversalRootMethods(
  {_entities, _indexesByID, rootEntityType, districtID, getNextID,
    entityAccessorPrototype, rootAccessorPrototype, $, _}
) {

  const universalRootMethods = {

    districtID,

    entityType: rootEntityType,

    get length() {
      return _entities.id.length - 1 // disclude default entity
    },

    create: () => {
      const id = getNextID.call(universalRootMethods)
      const index = $(_ + 'create/entity')(id, _entities)
      _indexesByID[id] = index
      const accessor = $(_ + 'create/accessor/entity')(id, entityAccessorPrototype, rootAccessorPrototype)
      return accessor
    }
  }

  return universalRootMethods
}
