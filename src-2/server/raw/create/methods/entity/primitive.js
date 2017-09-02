module.exports = function createPrimitiveAttributeMethod({
  _defaultValue: defaultValue, _attribute, attributeName, entityType, indexesByID, $, _
}) {

  const typeofDefaultValue = Number.isInteger(defaultValue)
    ? 'integer'
    : typeof defaultValue

  $(_ + 'filter/typeof-default-value')(
    defaultValue, typeofDefaultValue, attributeName, entityType
  )

  const primitiveAttributeMethod = Object.create({}, {[attributeName]: {

    get: function() {
      const index = indexesByID[this.id]
      return _attribute[index]
    },

    set: function(value) {
      const {id} = value
      if (id) value = id
      $(_ + 'filter/typeof-value')(value, typeofDefaultValue, attributeName, entityType)
      const index = indexesByID[this.id]
      _attribute[index] = value
    },

    enumerable: true
  }})

  return primitiveAttributeMethod
}
