module.exports = function createDistrictAccessor(io, now, $) {

  const _ = './raw/'

  const city = $(_ + 'create/accessor/city')($, _)
  $(_ + 'initiate')(city)

  const _district = $(_ + 'retrieve-district')(city)
  const {id: districtID, entities: _entityRoots} = _district

  const getNextID = $(_ + 'create/get-next-id')(city)
  let args

  const district = Object
    .entries(_entityRoots)
    .reduce((district, [rootEntityType, _entities]) => {
      args = {_entities, rootEntityType, district, districtID, getNextID, $, _}
      const rootAccessor = $(_ + 'create/accessor/root')(args)
      district[rootEntityType] = rootAccessor
      return district
    }, Object.create(null))

  const rawMethods = $(_ + 'create/methods/district')(args)
  const bufferedMethods = $('./buffered/create-methods/district')(district)

  $(_ + 'filter/duplicate-property-names')(_entityRoots, rawMethods, bufferedMethods)
  $(_ + 'add/methods')(district, rawMethods, bufferedMethods)

  return Object.freeze(district)
}
