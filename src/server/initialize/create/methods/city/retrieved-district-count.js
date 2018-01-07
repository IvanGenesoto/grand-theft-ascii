module.exports = function createRetrievedDistrictCount() {

  let _retrievedDistrictCount = 0

  return {

    get: () => _retrievedDistrictCount,

    increment: () => ++_retrievedDistrictCount,

    decrement: () => --_retrievedDistrictCount
  }
}
