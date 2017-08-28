module.exports = function createDistrictsByDistrictID() {

  const _districtsByDistrictID = []

  return {

    get: (districtID) => _districtsByDistrictID[districtID],

    add: function(district) {
      const districtID = this.id
      _districtsByDistrictID[districtID] = district
    }
  }
}
