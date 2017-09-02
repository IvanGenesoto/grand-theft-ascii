module.exports = function filterTypeofValue(
  value, typeofDefaultValue, attributeName, entityType
) {

  if (typeofDefaultValue === 'integer') {
    if (!Number.isInteger(value)) throw new TypeError( // eslint-disable-line curly
      entityType + ' ' + attributeName + ' must be an integer'
    )
    else if (value === 0) throw new RangeError( // eslint-disable-line curly
      entityType + ' ' + attributeName + ' cannot be 0'
    )
    else if (value < 0) throw new RangeError( // eslint-disable-line curly
      entityType + ' ' + attributeName + ' cannot be negative'
    )
    else return true
  }

  // eslint-disable-next-line no-self-compare
  if (value !== value) throw new TypeError( // eslint-disable-line curly
    entityType + ' ' + attributeName + ' must be a ' + typeofDefaultValue + ', not NaN'
  )

  const typeofValue = typeof value

  if (typeofValue !== typeofDefaultValue) throw new TypeError( // eslint-disable-line curly
    entityType + ' ' + attributeName + ' must be a ' + typeofDefaultValue +
    ', ' + value + ' is a ' + typeofValue
  )

  else return value
}
