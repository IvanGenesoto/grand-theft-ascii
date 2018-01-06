module.exports = function createCity($) {

  const city = {
    latestCityID: $('./create/methods/city/latest-city-id')(),
    districtCount: $('./create/methods/city/district-count')(),
    latestDistrictID: $('./create/methods/city/latest-district-id')(),
    districtsByDistrictID: $('./create/methods/city/districts-by-district-id')($),
    entityCounts: $('./create/methods/city/entity-counts')(),
    districtIDsByEntityID: $('./create/methods/city/district-ids-by-entity-id')($),
    entityCountsByDistrictID: $('./create/methods/city/entity-counts-by-district-id')(),
    $
  }

  return city
}
