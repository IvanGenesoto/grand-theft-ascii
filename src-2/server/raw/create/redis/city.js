module.exports = function createCity() {

  let _city = 0

  return {

    get: () => _city,

    increment: () => ++_city,

    decrement: () => {
      --_city
    }
  }
}
