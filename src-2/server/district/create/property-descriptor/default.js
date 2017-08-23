module.exports = function createDefaultPropertyDescriptor(args) {

  const {attributeName, _entities, indexesByID, typeofDefaultValue, entityType} = args
  const attribute = _entities[attributeName]

  return {

    get: function() {
      const index = indexesByID[this.id]
      return attribute[index]
    },

    set: function(value) {
      const index = indexesByID[this.id]
      const typofValue = typeof value
      if (typofValue === typeofDefaultValue) attribute[index] = value
      else {
        throw new TypeError(
          entityType + '.' + attributeName + ' must be a ' + typeofDefaultValue
        )
      }
    }
  }
}
