module.exports = function initializeDistrict() {

  const $ = require
  const cityAccessor = $('./create/accessor/city')($)
  $('./initialize-city')(cityAccessor)

  const getNextID = $('./create/get-next-id')(cityAccessor)
  const _district = $('./retrieve-district')(cityAccessor)

  return $('./create/accessor/district')({_district, getNextID, $})
}
