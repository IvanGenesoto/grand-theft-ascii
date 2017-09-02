module.exports = function addMethods(object, ...methods) {

  [...methods]
    .forEach(methods => Object
    .entries(methods)
    .forEach(([methodName, method]) => {
      object[methodName] = method
    }))

  return object
}
