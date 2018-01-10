module.exports = function appendMethods(parent, ...methods) {

  return [...methods].reduce(append, parent)

  function append(parent, methods) {
    Object
      .entries(methods)
      .forEach(([methodName, method]) => {
        const descriptor = Object.getOwnPropertyDescriptor(methods, methodName)
        return Object.defineProperty(parent, methodName, descriptor)
      })
    return parent
  }
}
