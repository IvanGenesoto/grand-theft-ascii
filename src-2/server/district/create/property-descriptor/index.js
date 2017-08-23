module.exports = function createPropertyDescriptor(
  attributeName, _entities, indexesByID
) {

  const $ = require
  const entityType = _entities.entityType[0]
  const attribute = _entities[attributeName]
  const defaultValue = attribute[0]

  if (Number.isInteger(defaultValue)) {
    return $('../create/property-descriptor/integer')(
      {attributeName, _entities, indexesByID, entityType}
    )
  }

  else if (Array.isArray(defaultValue)) {
    const nestedDefaultValue = defaultValue[0]
    const typeofDefaultValue = $('./check-typeof')(
      nestedDefaultValue, entityType, attributeName, 'boolean'
    )
    const standinArray = []
    return Number.isInteger(nestedDefaultValue)
      ? $('../create/property-descriptor/integer-array')(
        {attributeName, _entities, indexesByID, standinArray, entityType}
      )
      : $('../create/property-descriptor/array')(
      {attributeName, _entities, indexesByID, typeofDefaultValue, standinArray, entityType}
    )
  }

  else {
    const typeofDefaultValue = $('./check-typeof')(
      defaultValue, entityType, attributeName
    )
    return $('../create/property-descriptor/default')(
      {attributeName, _entities, indexesByID, typeofDefaultValue, entityType}
    )
  }
}
