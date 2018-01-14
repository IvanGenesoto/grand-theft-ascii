module.exports = function createRootAccessorPrototype(args) {

  let {_entityRoot, entityRootType, districtAccessor, modules} = args
  const {initialize} = modules
  const {append, create, filter} = initialize

  const _attributes = initialize.attributes[entityRootType]
  _entityRoot = append.attributes(_entityRoot, _attributes)

  const indexesByID = create.indexesById(_entityRoot, entityRootType)
  let rootAccessorPrototype = Object.create(null)
  const entityAccessorPrototype = create.accessor.entity.prototype({
    ...args, _entityRoot, indexesByID
  })

  const initiatedMethods = modules.initiate.createMethods.root[entityRootType](
    districtAccessor
  )
  const initializedMethods = create.methods.root({
    ...args, _entityRoot, indexesByID, entityAccessorPrototype, rootAccessorPrototype
  })

  filter.duplicatePropertyNames(initializedMethods, initiatedMethods)
  filter.integerPropertyNames(initializedMethods, initiatedMethods)
  rootAccessorPrototype = append.methods(
    rootAccessorPrototype, initializedMethods, initiatedMethods
  )

  const createEntityAccessor = create.accessor.entity
  rootAccessorPrototype = append.accessors.entity({
    _entityRoot, rootAccessorPrototype, entityAccessorPrototype, createEntityAccessor
  })

  return rootAccessorPrototype
}
