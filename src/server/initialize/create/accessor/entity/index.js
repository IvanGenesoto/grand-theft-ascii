module.exports = function createEntityAccessor(id, entityAccessorPrototype) {

  const entityAccessor = Object.create(entityAccessorPrototype)

  entityAccessor.id = id

  return Object.freeze(entityAccessor)
}
