module.exports = function appendAttributeAccessors(args) {

  const {_entities, entityType, caller, $, _} = args

  const _attributeEntries = Object.entries(_entities)

  return _attributeEntries.reduce(append, Object.create(null))

  function append(entityAccessorPrototype, _attributeEntry) {
    const [attributeName, _attribute] = _attributeEntry
    if (attributeName === 'id') return entityAccessorPrototype
    const [_defaultValue] = _attribute
    const attributeType = Array.isArray(_defaultValue) ? 'array' : 'primitive'
    const newArgs = {_defaultValue, _attribute, attributeName, attributeType, entityType, ...args}
    const attributeMethods = $(_ + 'create/methods/attribute/' + attributeType)(newArgs)
    Object.defineProperty(
      entityAccessorPrototype,
      attributeName,
      $(_ + 'create/descriptor')(caller, attributeMethods)
    )
    return entityAccessorPrototype
  }
}
