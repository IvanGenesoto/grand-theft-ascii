module.exports = function initializeCity(cityAccessor) {

  const {statusCode, districtCount} = cityAccessor

  const cityStatusCode = statusCode.increment()
  if (cityStatusCode > 1) return statusCode.decrement()

  const cityDistrictCount = districtCount.get()
  if (cityDistrictCount) throw new Error('Positive disctrictCount before city initialization')
  else return districtCount.increment()
}
