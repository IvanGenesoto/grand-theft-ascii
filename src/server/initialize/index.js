module.exports = function initialize(io, now, $) {

  const _ = './initialize/'

  const city = $(_ + 'create/accessor/city')($, _)
  $(_ + 'initiate-city')(city)

  const _district = $(_ + 'retrieve-district')(city)
  const {id: districtID, entities: _entityRoots} = _district

  const getNextID = $(_ + 'create/get-next-id')(city)

  const district = $(_ + 'create/accessor/district')({
    _entityRoots, districtID, getNextID, $, _
  })

  return district
}
