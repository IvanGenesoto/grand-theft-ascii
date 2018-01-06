module.exports = function initialize() {

  const $ = require

  const city = $('./create/accessor/city')($)
  $('./initiate-city')(city)

  const getNextID = $('./create/get-next-id')(city)
  const _district = $('./retrieve-district')(city)

  const {id: districtID, entities: _entityRoots} = _district

  return $('./create/accessor/district')({
    _entityRoots, districtID, getNextID, $
  })
}
