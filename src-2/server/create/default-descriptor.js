module.exports = function createDefaultDescriptor(...args) {
  const [attributeName, _entities, entities] = args
  return {
    get: function() {
      return _entities[attributeName][this.index]
    },
    set: function(value) {
      entities[attributeName](this.index, value)
    }
  }
}
