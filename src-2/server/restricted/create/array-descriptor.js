module.exports = function createArrayDescriptor(...args) {
  const [attributeName, standinArray, _entities, entities] = args
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
      entities[attributeName](this.index, value)
    }
  }
}
