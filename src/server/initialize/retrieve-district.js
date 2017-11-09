module.exports = function retrieveDistrict(
  {districtCount, latestDistrictID, districtsByDistrictID, $, _}
) {

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

  _district = $(_ + 'add/attributes')(_district, 'districts', $, _)
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
