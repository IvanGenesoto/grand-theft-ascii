module.exports = function createDistrictCount() {

  let _districtCount = 0

  return {

    get: () => _districtCount,

    increment: () => ++_districtCount
  }
}
