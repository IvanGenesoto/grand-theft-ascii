module.exports = function createCity(redis, $, _) {

  const city = {
    cityID: $(_ + 'create/accessor/city/city-id')(),
    districtCount: $(_ + 'create/accessor/city/district-count')(),
    districtID: $(_ + 'create/accessor/city/district-id')(),
    districtsByDistrictID: $(_ + 'create/accessor/city/districts-by-district-id')($, _),
    entityCounts: $(_ + 'create/accessor/city/entity-counts')(),
    districtIDsByEntityID: $(_ + 'create/accessor/city/district-ids-by-entity-id')($, _),
    entityCountsByDistrictID: $(_ + 'create/accessor/city/entity-counts-by-district-id')()
  }

  return city
}
