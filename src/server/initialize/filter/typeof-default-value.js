module.exports = function filterTypeofDefaultValue(
  defaultValue, typeofDefaultValue, attributeName, entityType, object
) {

  if (typeofDefaultValue === 'integer') return defaultValue

  if (Number.isNaN(defaultValue)) {
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
