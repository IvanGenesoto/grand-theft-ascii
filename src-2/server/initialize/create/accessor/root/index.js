module.exports = function createRootAccessor(args) {

  const {$, _} = args

  const rootAccessorPrototype = $(_ + 'create/accessor/root/prototype')(args)

  const rootAccessor = Object.create(rootAccessorPrototype)

  return Object.freeze(rootAccessor)
}
