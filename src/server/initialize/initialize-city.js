module.exports = function initializeCity(cityAccessor) {

  const {binaryStatus, districtCount} = cityAccessor

  const cityBinaryStatus = binaryStatus.increment()
  if (cityBinaryStatus > 1) return binaryStatus.decrement()

  const cityDistrictCount = districtCount.get()
  if (cityDistrictCount) throw new Error('Positive disctrictCount before city initialization')
  else return districtCount.increment()
}
