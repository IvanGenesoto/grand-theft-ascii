module.exports = function retrieveDistrict(city) {

  const {districtCount, latestDistrictID, districtsByDistrictID, $, _} = city

  const districtID = latestDistrictID.increment()
  if (districtID > districtCount.get()) {
    latestDistrictID.decrement()
    throw new Error('All districts already retrieved')
  }

  let _district = districtsByDistrictID.get(districtID)

  if (_district && _district.id !== districtID) {
    throw new Error(
      '_district.id (' + _district.id + ') does not match districtID (' + districtID + ')'
    )
  }

  const _attributes = $(_ + 'attributes/districts')
  _district = $(_ + 'append/attributes')(_district, _attributes)
  _district.id = districtID

  Object
    .entries(_district)
    .forEach(([attributeName, _attribute]) => {
      const typeofAttribute = typeof _attribute
      $(_ + 'filter/typeof-default-value')(
        _attribute, typeofAttribute, attributeName, 'district', 'object'
      )
    })

  return _district
}
