module.exports = function initializeDistrict(modules) {

  const {initialize, initiateDistrict, io, performanceNow: now} = modules
  const {create} = initialize

  const cityAccessor = create.accessor.city(modules)
  initialize.initializeCity(cityAccessor)

  const getNextID = create.getNextId(cityAccessor)
  const _district = initialize.retrieveDistrict(cityAccessor)

  return create.accessor.district({_district, getNextID, modules, io, now, initiateDistrict})
}
