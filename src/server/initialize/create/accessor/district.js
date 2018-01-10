module.exports = function createDistrictAccessor(args) {

  const {_district, $} = args
  const {id: districtID, entities: _entityRoots} = _district

  let districtAccessor = Object.create(null)
  districtAccessor = $('../initiate/append-$')(districtAccessor)
  districtAccessor = $('./append/accessors/root')({
    districtAccessor, districtID, _entityRoots, caller: {}, ...args
  })

  const initiatedMethods = $('../initiate/create-methods/district')(districtAccessor)
  const initializedMethods = $('./create/methods/district')({
    _district, districtAccessor, ...args
  })

  $('./filter/duplicate-property-names')(_entityRoots, initializedMethods, initiatedMethods)

  districtAccessor = $('./append/methods')(
    districtAccessor, initializedMethods, initiatedMethods
  )

  return Object.freeze(districtAccessor)
}
