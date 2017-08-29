module.exports = function initiateCity(
  {cityID, districtCount}
) {

  const _cityID = cityID.increment()
  if (_cityID > 1) return cityID.decrement()

  const _districtCount = districtCount.get()
  if (_districtCount) throw new Error('Positive disctrictCount before city initiation')

  else return districtCount.increment()
}
