module.exports = function getName(value, name, isNode) {
  if (isNode) return makeCamelCase(name)
  if (typeof value === 'function' && value.name) return value.name
  if (typeof value === 'object' && value.moduleName) return value.moduleName
  return makeCamelCase(name)
}

function makeCamelCase(name) {
  for (let i = 0, l = name.length; i < l; i++) {
    if (name[i] === '-' || name[i] === '.') {
      name = name.slice(0, i) +
      name[i + 1].toUpperCase() +
      name.slice(i + 2)
    }
  }
  return name
}
