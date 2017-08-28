module.exports = function retrieveDistrict(
  {city, districtCount, districtID, districtsByDistrictID}
) {

  if (!city.get()) {
    const _city = city.increment()
    if (_city > 1) return city.decrement()
    districtCount.increment()
  }

  if (districtID.get() >= districtCount.get()) return
  const _districtID = districtID.increment()
  if (_districtID > districtCount.get()) return districtID.decrement()

  const _district = districtsByDistrictID.get(_districtID) ||
    Object.create(null, {
      id: {value: _districtID},
      entityIndexesByID: {value: {}}
    })

  return _district
}
