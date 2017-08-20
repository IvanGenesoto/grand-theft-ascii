module.exports = function integer(attributeName, entitiesPrototype) {
  return {
    get: function() {
      return entitiesPrototype.standinArray
    },
    set: function(value) {
      entitiesPrototype[attributeName](this.index, value)
    }
  }
}
