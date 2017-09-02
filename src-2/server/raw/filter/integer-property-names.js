module.exports = function filterIntegerPropertyNames(...propertyGroups) {

  const integerNames = []

  propertyGroups.forEach(propertyGroup => Object
    .keys(propertyGroup)
    .forEach(propertyName => {
      if (Number.isInteger(propertyName)) integerNames.push(propertyName)
    })
  )

  const [integerName] = integerNames
  if (integerName) throw new Error('Integer property name(s) found: ' + integerNames)

  return propertyGroups
}
