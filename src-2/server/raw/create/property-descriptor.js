module.exports = function createPropertyDescriptor(args) {

  const {_attribute, $, _} = args
  let _defaultValue = _attribute[0]
  const get = true
  const thisContainer = Object.create(null)

  if (Array.isArray(_defaultValue)) {
    const defaultValue = _defaultValue[0]
    const typeofDefaultValue = typeof defaultValue
    const noBoolean = true
    $(_ + 'filter/typeof-default-value')(
      {...args, defaultValue, typeofDefaultValue, noBoolean}
    )
    const integer = Number.isInteger(defaultValue)
    const methods = $(_ + 'create/methods/entity-array')(
      {...args, typeofDefaultValue, integer, thisContainer}
    )
    return {
      get: function() {
        thisContainer.this = this
        return methods
      },
      enumerable: true
    }
  }

  else {
    const defaultValue = _defaultValue
    const typeofDefaultValue = typeof defaultValue
    $(_ + 'filter/typeof-default-value')({...args, defaultValue, typeofDefaultValue})
    const integer = Number.isInteger(defaultValue)
    return {
      get: $(_ + 'create/methods/entity-primitive')({...args, get, integer, typeofDefaultValue}),
      set: $(_ + 'create/methods/entity-primitive')({...args, integer, typeofDefaultValue}),
      enumerable: true
    }
  }
}
