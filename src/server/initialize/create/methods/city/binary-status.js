module.exports = function createBinaryStatus() {

  let _binaryStatus = 0

  return {

    get: () => _binaryStatus,

    increment: () => ++_binaryStatus,

    decrement: () => --_binaryStatus
  }
}
