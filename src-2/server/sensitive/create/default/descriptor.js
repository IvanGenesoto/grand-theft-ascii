module.exports = function createDefaultDescriptor(...args) {
  const [attributeName, _entities, entitiesPrototype] = args
  return {
    get: function() {
      return _entities[attributeName][this.index]
    },
    set: function(value) {
      entitiesPrototype[attributeName](this.index, value)
    }
  }
}
