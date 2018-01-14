module.exports = function appendAttributeAccessors(args) {

  const {entityAccessorPrototype, _entityRoot, entityType, caller, modules} = args
  const {initialize} = modules

  return Object
    .entries(_entityRoot)
    .reduce(append, entityAccessorPrototype)

  function append(entityAccessorPrototype, [attributeName, _attribute]) {
    if (attributeName === 'id') return entityAccessorPrototype
    let [_defaultValue] = _attribute
    const attributeType = Array.isArray(_defaultValue) ? 'array' : 'primitive'
    _defaultValue = attributeType === 'array'
      ? _defaultValue[0]
      : _defaultValue
    const typeofDefaultValue = Number.isInteger(_defaultValue)
      ? 'integer'
      : typeof _defaultValue
    initialize.filter.typeofDefaultValue(
      _defaultValue, typeofDefaultValue, attributeName, entityType
    )
    const {create} = initialize
    const attributeAccessor = create.accessor.attribute[attributeType]({
      _attribute, attributeName, attributeType, entityType, typeofDefaultValue, ...args
    })
    Object.defineProperty(
      entityAccessorPrototype,
      attributeName,
      create.descriptor(caller, attributeAccessor)
    )
    return entityAccessorPrototype
  }
}
