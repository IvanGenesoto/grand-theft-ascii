module.exports = function createDistrictAccessor(args) {

  const {_district, modules} = args
  const {id: districtID, entities: _entityRoots} = _district
  const {initialize, initiateDistrict} = modules
  const {append} = initialize

  let districtAccessor = Object.create(null)
  districtAccessor = append.accessors.root({
    ...args, districtAccessor, districtID, _entityRoots, caller: {}
  })

  const initiatedMethods = modules.initiate.createMethods.district(districtAccessor)
  const initializedMethods = initialize.create.methods.district({
    ...args, _district, districtAccessor
  })

  initialize.filter.duplicatePropertyNames(_entityRoots, initializedMethods, initiatedMethods)

  districtAccessor = append.methods(
    districtAccessor, initializedMethods, initiatedMethods
  )

  districtAccessor.initiateDistrict = initiateDistrict

  return Object.freeze(districtAccessor)
}
