module.exports = function filterAttributeNames(attributes) {

  const duplicates = []

  const attributeNames = Object
    .keys(attributes)
    .forEach(attributeName => {
      const index = attributeNames.indexOf(attributeName)
      const lastIndex = attributeNames.lastIndexOf(attributeName)
      if (index !== lastIndex) duplicates.push(attributeNames[index])
    })

  if (duplicates[0]) {
    throw new Error('Duplicate attribute name(s) found: ' + duplicates)
  }

  return attributes
}
