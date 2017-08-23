module.exports = function createDefaultArrayPropertyDescriptor(args) {

  const $ = require
  const {attributeName, _entities, indexesByID,
    typeofDefaultValue, standinArray, entityType} = args
  const attribute = _entities[attributeName]

  return {

    get: function() {
      standinArray.length = 0
      const index = indexesByID[this.id]
      const items = attribute[index]
      items.forEach((item, index) => standinArray[index] = item) // eslint-disable-line no-return-assign
      return standinArray
    },

    set: function(value) {
      const index = indexesByID[this.id]
      const items = attribute[index]
      if (typeof value === typeofDefaultValue) { // eslint-disable-line valid-typeof
        $('../methods/add')(value, items, index)
      }
      else {
        throw new TypeError(entityType + '.' + attributeName +
        ' must be ' + typeofDefaultValue + 's')
      }
    }
  }
}
