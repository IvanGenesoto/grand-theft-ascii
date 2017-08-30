module.exports = function createRootAccessors(
  {_district, district, districtID, getNextID, $, _}
) {

  const {entities: _allEntities} = _district

  const rootAccessors = Object
    .entries(_allEntities)

    .map(_entitiesEntry => {
      let [rootEntityType, _entities] = _entitiesEntry
      _entities = _entities.id
        ? _entities
        : $(_ + 'create/default-entities')(rootEntityType, $, _)

      const entityType = $(_ + 'create/entity/type')(rootEntityType)
      const indexesByID = $(_ + 'create/indexes-by-id')(_entities, rootEntityType)
      const args = {
        _entities,
        indexesByID,
        entityType,
        rootEntityType,
        getNextID,
        districtID: district.id,
        district,
        $,
        _
      }

      args.entityAccessorPrototype = $(_ + 'create/accessor/entity-prototype')(args)
      const rootAccessorPrototype = $(_ + 'create/accessor/root-prototype')(args)
      const rootAccessor = Object.create(rootAccessorPrototype)
      return Object.freeze(rootAccessor)
    })

  return rootAccessors
}
