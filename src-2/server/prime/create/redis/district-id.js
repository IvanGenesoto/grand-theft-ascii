module.exports = function CreateDistrictID() {

  let districtID = 0

  return {

    get: () => districtID,

    increment: () => ++districtID,

    decrement: () => {
      --districtID
    }
  }
}
