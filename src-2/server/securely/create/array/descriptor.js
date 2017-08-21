module.exports = function createArrayDescriptor(...args) {
  const [attributeName, standinArray, _entities, entitiesPrototype] = args
  return {
    get: function() {
      standinArray.length = 0
      const array = _entities[attributeName][this.index]
      array.forEach((value, index) => {
        standinArray[index] = value
      })
      return standinArray
    },
    set: function(value) {
      entitiesPrototype[attributeName](this.index, value)
    }
  }
}
