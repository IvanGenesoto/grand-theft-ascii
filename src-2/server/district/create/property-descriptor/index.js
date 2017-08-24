module.exports = function createPropertyDescriptor(args) {

  const $ = require
  const {attributeName, _entities} = args
  const attribute = _entities[attributeName]
  const defaultValue = attribute[0]

  if (Number.isInteger(defaultValue)) {
    return $('../create/property-descriptor/integer')(
      {...args, defaultValue}
    )
  }

  else if (Array.isArray(defaultValue)) {
    const boolean = 'boolean'
    const nestedDefaultValue = defaultValue[0]
    const typeofDefaultValue = $('./filter/typeof')(
      {...args, nestedDefaultValue, boolean}
    )
    const standinArray = []
    return Number.isInteger(nestedDefaultValue)
      ? $('../create/property-descriptor/integer-array')({...args, standinArray})
      : $('../create/property-descriptor/default-array')(
        {...args, typeofDefaultValue, standinArray}
      )
  }

  else {
    const typeofDefaultValue = $('./filter/typeof')({...args, defaultValue})
    return $('../create/property-descriptor/default')({...args, typeofDefaultValue})
  }
}
