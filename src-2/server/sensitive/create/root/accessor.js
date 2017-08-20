module.exports = function createRootAccessor(_entities) {

  const $ = require

  const rootAccessorPrototype = $('../create/root-accessor-prototype')(_entities)

  const rootAccessor = Object.create(rootAccessorPrototype)

  // get root methods
  // append to rootAccessor
  // freeze rootAccessor

  return rootAccessor
}
