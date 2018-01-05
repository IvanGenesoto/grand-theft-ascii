module.exports = function createDistrictsByDistrictID($, _) {

  const _districtsByDistrictID = [0]

  return {

    get: (districtID) => _districtsByDistrictID[districtID],

    add(district) {
      const districtID = this.id
      $(_ + 'filter/typeof-value')(districtID, 'integer', '', 'id', 'district')
      $(_ + 'filter/typeof-value')(district, false, 'object', '', 'district')
      _districtsByDistrictID[districtID] = district
    }
  }
}
