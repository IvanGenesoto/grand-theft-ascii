module.exports = function createPropertyDescriptor(args) {

  const {attribute, $} = args
  let defaultValue = attribute[0]
  const get = true
  const integer = true

  if (Number.isInteger(defaultValue)) return { // eslint-disable-line curly
    get: $('../create/common-methods/entity-primitive')({...args, get, integer}),
    set: $('../create/common-methods/entity-primitive')({...args, integer})
  }

  else if (Array.isArray(defaultValue)) {
    defaultValue = defaultValue[0]
    const typeofDefaultValue = typeof defaultValue
    const noBoolean = true
    $('./filter/typeof-default-value')({...args, defaultValue, noBoolean})
    return Number.isInteger(defaultValue)
      ? {value: $('../../create/common-methods/entity-array')({...args, integer})}
      : {value: $('../../create/common-methods/entity-array')(
        {...args, typeofDefaultValue})
      }
  }

  else {
    const typeofDefaultValue = typeof defaultValue
    $('./filter/typeof-default-value')({...args, defaultValue})
    return {
      get: $('../../create/entity-primitive')({...args, get, typeofDefaultValue}),
      set: $('../../create/entity-primitive')({...args, typeofDefaultValue})
    }
  }
}
