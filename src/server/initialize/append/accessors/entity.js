module.exports = function appendEntityAccessors({
  _entities, rootAccessorPrototype, entityAccessorPrototype, createEntityAccessor
}) {

  return _entities.id.reduce(append, rootAccessorPrototype)

  function append(rootAccessorPrototype, id, index) {
    if (!id) return rootAccessorPrototype
    const entityAccessor = createEntityAccessor(id, entityAccessorPrototype)
    rootAccessorPrototype[id] = entityAccessor
  }
}
