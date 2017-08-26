module.exports = function createDistrictAccessor(redisClient, io, $) {

  const redis = $('../../create/redis')(redisClient, $)
  const getNextID = $('../../create-get-next-id')(redis)
  const _district = $('../../retrieve-district')(redis)
  const {districtID, _entityIndexesByID} = _district

  $('../../entity-types').forEach(entityType => {
    _district[entityType] = _district[entityType] || []
  })

  let district = Object.create(null, {id: {value: districtID}})
  let rootEntityType

  district = Object
    .entries(_district)

    .map(_entities => {
      const _entitiesName = _entities[0]
      _entities = _entities[1]
      rootEntityType = _entitiesName.slice(1)
      return _entities || $('../../create/default/entities')(rootEntityType, $)
    })

    .map(_entities => {
      const _indexesByID =
        _entityIndexesByID[rootEntityType] = _entityIndexesByID[rootEntityType] || []
      const args = {
        _entities, _indexesByID, rootEntityType, getNextID, districtID, district
      }
      args.entityType = $('../../create/entity-type')(rootEntityType)
      args.entityAccessorPrototype = $('../../create/accessor/entity-prototype')(args)
      const rootAccessorPrototype = $('../../create/accessor/root-prototype')(args)
      const rootAccessor = Object.create(rootAccessorPrototype)
      return Object.freeze(rootAccessor)
    })

  return Object.freeze(district)
}
