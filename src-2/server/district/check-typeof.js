module.exports = function checkTypeof(
  defaultValue, entityType, attributeName, boolean) {

  if (defaultValue !== defaultValue) { // eslint-disable-line no-self-compare
    throw new TypeError('NaN found in ' + entityType + '.' + attributeName)
  }

  const typeofDefaultValue = typeof defaultValue

  if (
    typeofDefaultValue === 'null' ||
    typeofDefaultValue === 'undefined' ||
    typeofDefaultValue === 'object' ||
    typeofDefaultValue === 'function' ||
    typeofDefaultValue === boolean
  ) {
    throw new Error(
      typeofDefaultValue + ' found in ' + entityType + '.' + attributeName
    )
  }

  else return typeofDefaultValue
}
