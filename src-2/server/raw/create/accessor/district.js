module.exports = function createDistrictAccessor(redisClient, io, $, _) {

  const redis = $(_ + 'create/redis')(redisClient, $, _)
  const getNextID = $(_ + 'create/get-next-id')(redis)
  const _district = $(_ + 'retrieve-district')(redis)
  const {id: districtID, entityIndexesByID: _entityIndexesByID} = _district

  $(_ + 'entity-types').forEach(entityType => {
    _district[entityType] = _district[entityType] || []
  })

  const district = Object.create(null)

  const allRootAccessors = Object
    .entries(_district)

    .map(_entities => {
      const _entitiesName = _entities[0]
      _entities = _entities[1]
      const rootEntityType = _entitiesName.slice(1)
      return _entities[0]
      ? {rootEntityType, _entities}
      : {rootEntityType, _entities: $(_ + 'create/default-entities')(rootEntityType, $, _)}
    })

    .map(_entities => {
      const {rootEntityType} = _entities
      _entities = _entities._entities
      const entityType = $(_ + 'create/entity/type')(rootEntityType)
      const _indexesByID =
        _entityIndexesByID[rootEntityType] = _entityIndexesByID[rootEntityType] || []
      const args = {
        _entities, _indexesByID, entityType, rootEntityType, getNextID, districtID, district, $, _
      }
      args.entityAccessorPrototype = $(_ + 'create/accessor/entity-prototype')(args)
      const rootAccessorPrototype = $(_ + 'create/accessor/root-prototype')(args)
      const rootAccessor = Object.create(rootAccessorPrototype)
      return Object.freeze(rootAccessor)
    })

  allRootAccessors.forEach(rootAccessor => {
    const entityType = rootAccessor.entityType
    district[entityType] = rootAccessor
  })

  return Object.freeze(district)
}
