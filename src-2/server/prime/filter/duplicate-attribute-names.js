module.exports = function filterAttributeNames(attributes) {

  const attributeNames = Object.keys(attributes)

  const duplicates = attributeNames.reduce(duplicates, attributeName => { // eslint-disable-line no-use-before-define
    const index = attributeNames.indexOf(attributeName)
    const lastIndex = attributeNames.lastIndexOf(attributeName)
    duplicates = [...duplicates] // eslint-disable-line no-const-assign
    if (index !== lastIndex) duplicates.push(attributeNames[index])
    return duplicates
  })

  if (duplicates[0]) {
    throw new Error('Duplicate attribute name(s) found:', duplicates)
  }

  else return true
}
