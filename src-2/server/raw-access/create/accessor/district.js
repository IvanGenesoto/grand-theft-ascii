module.exports = function createDistrictAccessor(city, $, _) {

  const _district = $(_ + 'retrieve-district')({...city, $, _})
  const {id} = _district

  const district = Object.create(null, {id: {value: id}})
  const getNextID = $(_ + 'create/get-next-id')(city)

  const rootAccessors = $(_ + 'create/accessor/roots')(
    {_district, district, getNextID, $, _}
  )

  rootAccessors.forEach(rootAccessor => {
    const rootEntityType = rootAccessor.entityType
    district[rootEntityType] = rootAccessor
  })

  return Object.freeze(district)
}
