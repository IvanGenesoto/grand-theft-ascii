module.exports = function filterMethodNames(methodName, descriptor) {

  if (!descriptor) return true

  const duplicates = Object
    .keys(descriptor)

    .reduce(duplicates, descriptorMethodName => { // eslint-disable-line no-use-before-define
      const duplicates = [...duplicates] // eslint-disable-line no-use-before-define
      if (descriptorMethodName === methodName) duplicates.push(methodName)
      return duplicates
    })

  if (duplicates[0]) {
    throw new TypeError('Duplicate method name(s) found: ' + duplicates)
  }

  else return true
}
