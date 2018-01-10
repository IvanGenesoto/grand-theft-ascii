module.exports = function createRootAccessor(rootAccessorPrototype) {

  return Object.freeze(Object.create(rootAccessorPrototype))
}
