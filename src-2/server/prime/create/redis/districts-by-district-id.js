module.exports = function createDistrictsByDistrictID() {

  const districtsByDistrictID = []

  return {

    get: (districtID) => districtsByDistrictID[districtID],

    add: function(district) {
      const districtID = this.id
      districtsByDistrictID[districtID] = district
    }
  }
}
