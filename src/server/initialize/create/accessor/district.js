module.exports = function createDistrictAccessor(args) {

  const {_entityRoots, $, _} = args
  const caller = {}

  const district = Object
    .entries(_entityRoots)
    .reduce((district, [rootEntityType, _entities]) => {
      args = {...args, _entities, rootEntityType, district, caller}
      const rootAccessor = $(_ + 'create/accessor/root')(args)
      district[rootEntityType] = rootAccessor
      return district
    }, Object.create(null))

  const initializedMethods = $(_ + 'create/methods/district')(args)
  const initiatedMethods = $('./initiate/create-methods/district')(district)

  $(_ + 'filter/duplicate-property-names')(_entityRoots, initializedMethods, initiatedMethods)
  $(_ + 'append/methods')(district, initializedMethods, initiatedMethods)

  return Object.freeze(district)
}
