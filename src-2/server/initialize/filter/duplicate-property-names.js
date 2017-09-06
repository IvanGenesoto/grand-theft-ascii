module.exports = function filterDuplicatePropertyNames(...propertyGroups) {

  const testContainer = {}
  const duplicates = []

  propertyGroups.forEach(propertyGroup => Object
    .keys(propertyGroup)
    .forEach(propertyName => {
      if (testContainer[propertyName]) duplicates.push(propertyName)
      else testContainer[propertyName] = true
    })
  )

  const [duplicate] = duplicates
  if (duplicate) throw new Error('Duplicate attribute name(s) found: ' + duplicates)

  return propertyGroups
}
