module.exports = function createAllRootAccessors(
  {_allEntities, _allEntityIndexesByID, getNextID, districtID, district}
) {

  const $ = require

  const allRootAccessors = Object.entries(_allEntities)

    .map(_entities => _entities[1]
      ? _entities
      : [_entities[0], $('../../entities/' + _entities[0])])

    .map(_entities => {
      const entityType = _entities[0].slice(1, _entities[0].length - 1)
      _entities = _entities[1]
      const _indexesByID = _allEntityIndexesByID[entityType]
      const args = {_entities, _indexesByID, entityType, getNextID, districtID, district}
      args.individualAccessorPrototype = $('../create/accessor/individual-prototype')(args)
      const rootAccessorPrototype = $('../create/accessor/root-prototype')(args)
      const rootAccessor = Object.freeze(Object.create(rootAccessorPrototype))
      return rootAccessor
    })

  return allRootAccessors
}
