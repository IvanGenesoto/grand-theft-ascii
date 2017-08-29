module.exports = function createCity(redis, $, _) {

  const city = {
    cityID: $(_ + 'create/city/city-id')(),
    districtCount: $(_ + 'create/city/district-count')(),
    districtID: $(_ + 'create/city/district-id')(),
    districtsByDistrictID: $(_ + 'create/city/districts-by-district-id')($, _),
    entityCounts: $(_ + 'create/city/entity-counts')(),
    districtIDsByEntityID: $(_ + 'create/city/district-ids-by-entity-id')($, _),
    entityCountsByDistrictID: $(_ + 'create/city/entity-counts-by-district-id')()
  }

  $(_ + 'create/city/initiate')(city)

  return city
}
