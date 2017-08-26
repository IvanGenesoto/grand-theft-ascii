module.exports = function createRedis(redisClient, $) {

  return {
    districtCount: $('./create/redis/district-count'),
    districtID: $('./create/redis/district-id')(),
    entityCounts: $('./create/redis/entity-counts')(),
    districtIDsByEntityID: $('./create/redis/district-ids-by-entity-id')(),
    entityCountsByDistrictID: $('./create/redis/entity-counts-by-district-id')(),
    districtsByDistrictID: $('./create/redis/districts-by-district-id')()
  }
}
