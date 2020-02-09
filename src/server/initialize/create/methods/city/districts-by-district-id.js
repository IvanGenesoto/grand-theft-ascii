module.exports = function createDistrictsByDistrictID(modules) {
  const {filter} = modules.initialize

  const _districtsByDistrictID = [0]

  return {

    get: (districtID) => _districtsByDistrictID[districtID],

    add(district) {
      const districtID = this.id // #debug: district.id ??
      filter.typeofValue(districtID, 'integer', '', 'id', 'district')
      filter.typeofValue(district, false, 'object', '', 'district')
      _districtsByDistrictID[districtID] = district
    }
  }
}
