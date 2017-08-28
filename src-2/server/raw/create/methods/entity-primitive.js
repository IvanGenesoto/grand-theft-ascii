module.exports = function createUniversalEntityPrimitiveMethods(
  {get, integer, typeofDefaultValue, _attribute, attributeName, entityType, _indexesByID, $, _}
) {

  return get

    ? function() { // get
      const index = _indexesByID[this.id]
      return _attribute[index]
    }

    : function(value) { // set
      if (integer && value.id) value = value.id
      $(_ + 'filter/typeof-value')(
        value, integer, typeofDefaultValue, attributeName, entityType
      )
      const index = _indexesByID[this.id]
      _attribute[index] = value
    }
}
