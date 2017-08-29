module.exports = function CreateDistrictID() {

  let _districtID = 0

  return {

    get: () => _districtID,

    increment: () => ++_districtID,

    decrement: () => {
      --_districtID
    }
  }
}
