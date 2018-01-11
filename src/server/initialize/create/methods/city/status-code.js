module.exports = function createStatusCode() {

  let _statusCode = 0

  return {

    get: () => _statusCode,

    increment: () => ++_statusCode,

    decrement: () => --_statusCode
  }
}
