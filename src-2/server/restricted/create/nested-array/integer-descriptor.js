module.exports = function integer(attributeName, entities) {
  return {
    get: function() {
      return entities.standinArray
    },
    set: function(value) {
      return entities[attributeName](this.index, value)
    }
  }
}
