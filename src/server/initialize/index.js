module.exports = function initializeDistrict(modules) {

  const $ = require
  const cityAccessor = $('./create/accessor/city')($)
  $('./initialize-city')(cityAccessor)

  const getNextID = $('./create/get-next-id')(cityAccessor)
  const _district = $('./retrieve-district')(cityAccessor)

  const {server, socketIo, performanceNow} = modules
  const io = socketIo(server)
  const now = performanceNow

  return $('./create/accessor/district')({_district, getNextID, $, io, now})
}
