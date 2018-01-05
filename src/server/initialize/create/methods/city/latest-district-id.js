module.exports = function createLatestDistrictID() {

  let _latestDistrictID = 0

  return {

    get: () => _latestDistrictID,

    increment: () => ++_latestDistrictID,

    decrement: () => --_latestDistrictID
  }
}
