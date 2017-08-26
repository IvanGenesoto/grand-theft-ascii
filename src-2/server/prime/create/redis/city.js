module.exports = function createCity() {

  let city = 0

  return {

    get: () => city,

    increment: () => ++city,

    decrement: () => {
      --city
    }
  }
}
