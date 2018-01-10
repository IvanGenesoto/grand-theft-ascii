module.exports = function appendRootAccessors(args) {

  const {districtAccessor, _entityRoots, $} = args

  return Object
    .entries(_entityRoots)
    .reduce(append, districtAccessor)

  function append(districtAccessor, [entityRootType, _entityRoot]) {
    const rootAccessorPrototype = $('./create/accessor/root/prototype')({
      _entityRoot, entityRootType, ...args
    })
    const rootAccessor = $('./create/accessor/root')(rootAccessorPrototype, ...args)
    districtAccessor[entityRootType] = rootAccessor
    return districtAccessor
  }
}
