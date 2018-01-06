module.exports = function createDistrictsByDistrictID($) {

  const _districtsByDistrictID = [0]

  return {

    get: (districtID) => _districtsByDistrictID[districtID],

    add(district) {
      const districtID = this.id
      $('./filter/typeof-value')(districtID, 'integer', '', 'id', 'district')
      $('./filter/typeof-value')(district, false, 'object', '', 'district')
      _districtsByDistrictID[districtID] = district
    }
  }
}
