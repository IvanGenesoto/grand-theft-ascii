module.exports = function string(attributeName) {
  return {
    get: function() {
      throw console.log('Scenery getter not implemented')
    },
    set: function(value) {
      throw console.log('Scenery setter not implemented')
    }
  }
}
