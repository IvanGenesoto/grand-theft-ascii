module.exports = function createPrimitiveAttributeMethods({
  _defaultValue: defaultValue, _attribute, attributeName, caller, entityType, indexesByID, $, _
}) {

  const typeofDefaultValue = Number.isInteger(defaultValue)
    ? 'integer'
    : typeof defaultValue

  $(_ + 'filter/typeof-default-value')(
    defaultValue, typeofDefaultValue, attributeName, entityType
  )

  const attributeMethods = {

    get() {
      const index = indexesByID[caller.id]
      return _attribute[index]
    },

    set(value) {
      const {id} = value
      if (id) value = id
      $(_ + 'filter/typeof-value')(value, typeofDefaultValue, attributeName, entityType)
      const index = indexesByID[caller.id]
      _attribute[index] = value
    }
  }

  return attributeMethods
}
