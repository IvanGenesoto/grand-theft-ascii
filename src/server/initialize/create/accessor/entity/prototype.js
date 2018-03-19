module.exports = function createEntityAccessorPrototype(args) {

  const {_entityRoot, entityRootType, districtAccessor, modules} = args
  const {initialize} = modules
  const {create, append} = initialize

  const entityType = create.entityType(entityRootType)
  let entityAccessorPrototype = Object.create(null)
  entityAccessorPrototype = append.accessors.attribute({
    entityAccessorPrototype, entityType, ...args
  })

  const initializedMethods = create.methods.entity(args)
  const initiatedMethods = modules.initiate.createMethods.entity[entityType](
    districtAccessor, modules.initiate
  )

  initialize.filter.duplicatePropertyNames(
    _entityRoot, initializedMethods, initiatedMethods
  )

  entityAccessorPrototype = append.methods(
    entityAccessorPrototype, initializedMethods, initiatedMethods
  )

  return Object.freeze(entityAccessorPrototype)
}
