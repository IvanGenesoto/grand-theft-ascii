module.exports = function appendMethods(parent, ...methods) {

  return [...methods].reduce(append, parent)

  function append(parent, methods) {
    Object
      .entries(methods)
      .forEach(([methodName, method]) => parent[methodName] = method) // eslint-disable-line no-return-assign
    return parent
  }
}
