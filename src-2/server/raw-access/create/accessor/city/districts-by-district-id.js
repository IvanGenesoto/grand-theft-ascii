module.exports = function createDistrictsByDistrictID($, _) {

  const _districtsByDistrictID = []

  return {

    get: (districtID) => _districtsByDistrictID[districtID],

    add(district) {
      const districtID = this.id
      $(_ + 'filter/typeof-value')(districtID, true, undefined, '', 'district')
      $(_ + 'filter/typeof-value')(district, false, 'object', '', 'district')
      _districtsByDistrictID[districtID] = district
    }
  }
}
