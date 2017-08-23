module.exports = function createIntegerArrayPropertyDescriptor(args) {

  const $ = require
  const {attributeName, _entities, indexesByID, standinArray, entityType} = args
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
      if (!Number.isInteger(value)) {
        throw new TypeError(entityType + '.' + attributeName + ' must be integers')
      }
      else if (value === 0) {
        throw TypeError(entityType + '.' + attributeName + ' cannot be 0')
      }
      else if (value > 0) $('../../add')(value, items, index)
      else $('../../remove')(value, items, index)
    }
  }
}
