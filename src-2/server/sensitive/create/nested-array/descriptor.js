module.exports = function createNestedArrayDescriptor(...args) {
  let [attributeName, attribute, entitiesPrototype] = args
  const $ = require
  while (Array.isArray(attribute)) attribute = attribute[0]
  const defaultValue = attribute
  if (Number.isInteger(defaultValue)) {
    return $('../../create/nested-array/integer-descriptor')(attributeName, entitiesPrototype)
  }
  else if (typeof defaultValue === 'string') {
    return $('../../create/nested-array/string-descriptor')(attributeName)
  }
  else throw new Error('Cannot create nested property descriptor of non-integer or -string')
}
