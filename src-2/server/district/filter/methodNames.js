module.exports = function filterMethodNames(method, descriptors) {

  const duplicates = []

  descriptors.forEach(descriptor => {
    Object.keys(descriptor)
      .forEach(methodName => {
        if (methodName === method[0]) duplicates.push(methodName)
      })
  })

  if (duplicates[0]) {
    throw new TypeError('Duplicate method names found: ' + duplicates)
  }

  return duplicates[0] === undefined
}
