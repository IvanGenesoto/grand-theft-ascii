module.exports = function filterTypeofDefaultValue(
  {defaultValue, typeofDefaultValue, entityType, attributeName, noBoolean}
) {

  if (defaultValue !== defaultValue) { // eslint-disable-line no-self-compare
    throw new TypeError('NaN found in ' + entityType + ' ' + attributeName)
  }

  const boolean = noBoolean ? 'boolean' : undefined

  if (
    typeofDefaultValue === 'null' ||
    typeofDefaultValue === 'undefined' ||
    typeofDefaultValue === 'object' ||
    typeofDefaultValue === 'function' ||
    typeofDefaultValue === boolean
  ) {
    throw new Error(
      typeofDefaultValue + ' found in ' + entityType + ' ' + attributeName
    )
  }

  else return true
}
