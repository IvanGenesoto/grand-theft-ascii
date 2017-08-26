module.exports = function createCommonEntityPrimitiveMethods(
  {get, integer, typeofDefaultValue, attribute, attributeName, entityType, indexesByID, $}
) {

  return get

    ? function() {
      const index = indexesByID[this.id]
      return attribute[index]
    }

    : function(value) {
      $('../../filter/typeof')(
        value, integer, typeofDefaultValue, attributeName, entityType
      )
      const index = indexesByID[this.id]
      attribute[index] = value
    }
}
