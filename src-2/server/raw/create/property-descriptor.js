module.exports = function createPropertyDescriptor(args) {

  const {_attribute, $, _} = args
  let _defaultValue = _attribute[0]
  const get = true

  if (Array.isArray(_defaultValue)) {
    const idCashe = Object.create(null)
    const defaultValue = _defaultValue[0]
    const typeofDefaultValue = typeof defaultValue
    const noBoolean = true
    $(_ + 'filter/typeof-default-value')(
      {...args, defaultValue, typeofDefaultValue, noBoolean}
    )
    const integer = Number.isInteger(defaultValue)
    const methods = Object.freeze(
      $(_ + 'create/methods/entity-array')(
        {...args, typeofDefaultValue, integer, idCashe}
      )
    )
    return {
      get: function() {
        idCashe.id = this.id
        return methods
      },
      set: function(value) {
        idCashe.id = this.id
        methods.add(value)
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
