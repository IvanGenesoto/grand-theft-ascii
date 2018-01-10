module.exports = function createDescriptor(caller, attributeMethods) {
  return {
    get: function() {
      caller.id = this.id
      return attributeMethods
    },
    enumerable: true
  }
}
