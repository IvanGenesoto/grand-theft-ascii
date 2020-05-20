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
    modules,
    _
  }
) {

  const {create} = modules.initialize

  return {

    districtID,

    entityType: entityRootType,

    getLength() {
      return _entityRoot.id.length - 1 // #note: #Exclude default entity.
    },

    create() {
      const id = getNextID.call(this)
      const index = create.entity(id, _entityRoot)
      indexesByID[id] = index
      const entityAccessor = create.accessor.entity.index(id, entityAccessorPrototype)
      rootAccessorPrototype[id] = entityAccessor
      _entityRoot.district[index] = districtID
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
    },

    getIDWithAttribute(attributeType, value) {
      debugger
      const _attributeByIndex = _entityRoot[attributeType]
      const _idByIndex = _entityRoot.id
      const index = _attributeByIndex.indexOf(value)
      console.log({attributeType, value, _entityRoot, _attributeByIndex, _idByIndex, index, id: _idByIndex[index]})
      return _idByIndex[index]
    }
  }
}
