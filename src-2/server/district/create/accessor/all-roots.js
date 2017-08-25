module.exports = function createAllRootAccessors(
  {_allEntities, _allEntityIndexesByID, getNextID, districtID, district}
) {

  const $ = require
  let rootEntityType

  const allRootAccessors = Object
    .entries(_allEntities)

    .map(_entities => {
      rootEntityType = _entities[0].slice(1)
      return _entities[1] || $('../default-entities/' + rootEntityType)
    })

    .map(_entities => {
      const _indexesByID = _allEntityIndexesByID[rootEntityType]
      const args = {_entities, _indexesByID, rootEntityType, getNextID, districtID, district}
      args.entityType = $('../../create/entity-type')(rootEntityType)
      args.individualAccessorPrototype = $('../../create/accessor/individual-prototype')(args)
      const rootAccessorPrototype = $('../../create/accessor/root-prototype')(args)
      const rootAccessor = Object.freeze(Object.create(rootAccessorPrototype))
      return rootAccessor
    })

  return allRootAccessors
}
