module.exports = function createDistrictAccessor(redis, io, $, _) {

  const city = $(_ + 'create/city')(redis, $, _)

  const getNextID = $(_ + 'create/get-next-id')(city)

  const _district = $(_ + 'retrieve-district')({...city, $, _})

  const {id: districtID} = _district

  const district = Object.create(null)

  const rootAccessors = $(_ + 'create/accessor/roots')(
    {_district, district, districtID, getNextID, $, _}
  )

  rootAccessors.forEach(rootAccessor => {
    const rootEntityType = rootAccessor.entityType
    district[rootEntityType] = rootAccessor
  })

  return Object.freeze(district)
}
