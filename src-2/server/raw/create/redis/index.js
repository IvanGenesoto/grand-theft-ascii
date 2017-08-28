module.exports = function createRedis(redisClient, $, _) {

  _ += 'create/redis/'

  return {
    city: $(_ + 'city')(),
    districtCount: $(_ + 'district-count')(),
    districtID: $(_ + 'district-id')(),
    entityCounts: $(_ + 'entity-counts')(),
    districtIDsByEntityID: $(_ + 'district-ids-by-entity-id')(),
    entityCountsByDistrictID: $(_ + 'entity-counts-by-district-id')(),
    districtsByDistrictID: $(_ + 'districts-by-district-id')()
  }
}
