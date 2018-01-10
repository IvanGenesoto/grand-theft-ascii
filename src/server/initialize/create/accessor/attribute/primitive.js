module.exports = function createPrimitiveAttributeAccessor({
  _attribute, attributeName, caller, entityType, typeofDefaultValue, indexesByID, $
}) {

  return Object.freeze({

    get() {
      const index = indexesByID[caller.id]
      return _attribute[index]
    },

    set(value) {
      const {id} = value
      if (id) value = id
      $('./filter/typeof-value')(value, typeofDefaultValue, attributeName, entityType)
      const index = indexesByID[caller.id]
      _attribute[index] = value
    }
  })
}
