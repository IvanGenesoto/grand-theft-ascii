module.exports = function appendEntityAccessors({
  _entityRoot, rootAccessorPrototype, entityAccessorPrototype, createEntityAccessor
}) {

  return _entityRoot.id.reduce(append, rootAccessorPrototype)

  function append(rootAccessorPrototype, id, index) {
    if (!id) return rootAccessorPrototype
    const entityAccessor = createEntityAccessor(id, entityAccessorPrototype)
    rootAccessorPrototype[id] = entityAccessor
  }
}
