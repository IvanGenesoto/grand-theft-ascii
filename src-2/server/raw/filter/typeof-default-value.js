module.exports = function filterTypeofDefaultValue(
  defaultValue, typeofDefaultValue, attributeName, entityType, object
) {

  if (typeofDefaultValue === 'integer') return defaultValue

  if (defaultValue !== defaultValue) { // eslint-disable-line no-self-compare
    throw new TypeError('NaN found in ' + entityType + ' ' + attributeName)
  }

  if (!(
    typeofDefaultValue === 'number' ||
    typeofDefaultValue === 'string' ||
    typeofDefaultValue === 'boolean' ||
    typeofDefaultValue === object
  )) {
    throw new Error(
      typeofDefaultValue + ' found in ' + entityType + ' ' + attributeName
    )
  }

  else return defaultValue
}
