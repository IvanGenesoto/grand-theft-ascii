module.exports = function createCityID() {

  let _cityID = 0

  return {

    get: () => _cityID,

    increment: () => ++_cityID,

    decrement: () => {
      --_cityID
    }
  }
}
