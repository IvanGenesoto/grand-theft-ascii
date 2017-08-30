module.exports = function retrieveDistrict(
  {cityID, districtCount, districtID, districtsByDistrictID, $, _}
) {

  const _districtID = districtID.increment()
  if (_districtID > districtCount.get()) {
    districtID.decrement()
    throw new Error('All districts already retrieved')
  }

  let _district = districtsByDistrictID.get(_districtID)

  if (_district && (!_district.id !== districtID)) {
    throw new Error('_distict.id does not match districtID')
  }

  else {
    _district = $(_ + 'create/default-entities')('districts', $, _)
    _district.id = _districtID
  }

  return _district
}
