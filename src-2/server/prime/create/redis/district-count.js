module.exports = function createDistrictCount() {

  let districtCount = 0

  return {

    get: () => districtCount,

    increment: () => ++districtCount
  }
}
