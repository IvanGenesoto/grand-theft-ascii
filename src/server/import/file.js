module.exports = function importFile({
  module, filePath, parentObject, name, getName, enumerable, isNode
}) {
  const value = module.require(filePath)
  if (typeof value === 'object' && value.shouldAppendProperties) {
    return Object.entries(value).reduce(appendProperties, parentObject)
  }
  name = getName(value, name, isNode)
  return Object.defineProperty(parentObject, name, {value, enumerable})
}

function appendProperties(parentObject, [key, value]) {
  if (typeof value === 'object') value = Object.freeze(value)
  return Object.defineProperty(parentObject, key, {value, enumerable: true})
}
