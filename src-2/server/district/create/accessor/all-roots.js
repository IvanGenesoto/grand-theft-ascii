module.exports = function createAllRootAccessors(_allEntities, _allEntityIndexes, districtID) {

  const $ = require

  const allRootAccessors = Object.entries(_allEntities)
    .map(_entities => _entities[1] || $('../entities/' + _entities[0]))
    .map(_entities => {
      const entityType = _entities.entityType[0]
      const _indexesByID = _allEntityIndexes[entityType]
      const args = {_entities, _indexesByID, entityType, districtID}
      args.accessorPrototype = $('../create/accessor/prototype')(args)
      const rootAccessorPrototype = $('../create/root-accessor/prototype')(args)
      const rootAccessor = $('./create/root-accessor')(rootAccessorPrototype)
      return rootAccessor
    })

  return allRootAccessors
}
