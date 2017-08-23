module.exports = function createIntegerPropertyDescriptor(args) {

  const {attributeName, _entities, indexesByID, entityType} = args
  const attribute = _entities[attributeName]

  return {

    get: function() {
      const index = indexesByID[this.id]
      return attribute[index]
    },

    set: function(value) {
      const index = indexesByID[this.id]
      if (Number.isInteger(value)) attribute[index] = value
      else {
        throw new TypeError(
          entityType + '.' + attributeName + ' must be an integer'
        )
      }
    }
  }
}
