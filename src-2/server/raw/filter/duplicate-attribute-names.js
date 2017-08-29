module.exports = function filterAttributeNames(attributes) {

  const attributeNames = Object.keys(attributes)

  const duplicates = attributeNames.reduce((duplicates, attributeName) => {
    const index = attributeNames.indexOf(attributeName)
    const lastIndex = attributeNames.lastIndexOf(attributeName)
    duplicates = [...duplicates]
    if (index !== lastIndex) duplicates.push(attributeNames[index])
    return duplicates
  }, [])

  if (duplicates[0]) {
    throw new Error('Duplicate attribute name(s) found: ' + duplicates)
  }

  else return attributes
}
