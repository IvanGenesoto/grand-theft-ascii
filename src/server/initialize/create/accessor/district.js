module.exports = function createDistrictAccessor(args) {

  const {_entityRoots, $} = args

  let districtAccessor = Object.create(null)
  districtAccessor = $('../initiate/append-$')(districtAccessor)
  districtAccessor = $('./append/accessors/root')({districtAccessor, caller: {}, ...args})

  const initializedMethods = $('./create/methods/district')(args)
  const initiatedMethods = $('../initiate/create-methods/district')(districtAccessor)

  $('./filter/duplicate-property-names')(_entityRoots, initializedMethods, initiatedMethods)

  districtAccessor = $('./append/methods')(districtAccessor, initializedMethods, initiatedMethods)

  return Object.freeze(districtAccessor)
}
