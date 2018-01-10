module.exports = function retrieveDistrict(cityAccessor) {

  const {districtCount, retrievedDistrictCount, districtsByDistrictID, $} = cityAccessor

  const districtID = retrievedDistrictCount.increment()
  if (districtID > districtCount.get()) {
    retrievedDistrictCount.decrement()
    throw new Error('All districts already retrieved')
  }

  let _district = districtsByDistrictID.get(districtID)
  if (_district && _district.id !== districtID) {
    throw new Error(
      '_district.id (' + _district.id + ') does not match districtID (' + districtID + ')'
    )
  }

  _district = $('./append/attributes')(_district, $('./attributes/districts'))
  _district.id = districtID

  Object
    .entries(_district)
    .forEach(([attributeName, _attribute]) => {
      $('./filter/typeof-default-value')(
        _attribute, typeof _attribute, attributeName, 'district', 'object'
      )
    })

  return _district
}
