module.exports = function appendMethods(object, ...methods) {

  [...methods]
    .forEach(methods => Object
    .entries(methods)
    .forEach(([methodName, method]) => object[methodName] = method)) // eslint-disable-line no-return-assign

  return object
}
