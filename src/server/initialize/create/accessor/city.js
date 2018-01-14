module.exports = function createCityAccessor(modules) {
  const {city} = modules.initialize.create.methods

  return Object.freeze({
    statusCode: city.statusCode(),
    districtCount: city.districtCount(),
    retrievedDistrictCount: city.retrievedDistrictCount(),
    districtsByDistrictID: city.districtsByDistrictId(modules),
    entityCounts: city.entityCounts(),
    districtIDsByEntityID: city.districtIdsByEntityId(modules),
    entityCountsByDistrictID: city.entityCountsByDistrictId(),
    modules
  })
}
