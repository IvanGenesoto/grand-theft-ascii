module.exports = function createCity($, _) {

  const city = {
    latestCityID: $(_ + 'create/methods/city/latest-city-id')(),
    districtCount: $(_ + 'create/methods/city/district-count')(),
    latestDistrictID: $(_ + 'create/methods/city/latest-district-id')(),
    districtsByDistrictID: $(_ + 'create/methods/city/districts-by-district-id')($, _),
    entityCounts: $(_ + 'create/methods/city/entity-counts')(),
    districtIDsByEntityID: $(_ + 'create/methods/city/district-ids-by-entity-id')($, _),
    entityCountsByDistrictID: $(_ + 'create/methods/city/entity-counts-by-district-id')(),
    $,
    _
  }

  return city
}
