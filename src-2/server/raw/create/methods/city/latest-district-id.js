module.exports = function CreateLatestDistrictID() {

  let _latestDistrictID = 0

  return {

    get: () => _latestDistrictID,

    increment: () => ++_latestDistrictID,

    decrement: () => {
      --_latestDistrictID
    }
  }
}
