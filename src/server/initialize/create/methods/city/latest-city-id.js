module.exports = function createLatestCityID() {

  let _latestCityID = 0

  return {

    get: () => _latestCityID,

    increment: () => ++_latestCityID,

    decrement: () => --_latestCityID
  }
}
