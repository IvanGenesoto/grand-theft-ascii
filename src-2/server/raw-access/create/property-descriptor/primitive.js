module.exports = function createPrimitivePropertyDescriptor(args) {

  const {_defaultValue: defaultValue, $, _} = args

  const typeofDefaultValue = typeof defaultValue
  $(_ + 'filter/typeof-default-value')({...args, defaultValue, typeofDefaultValue})

  const integer = Number.isInteger(defaultValue)
  const get = true

  return {
    get: $(_ + 'create/methods/entity-primitive')(
      {...args, get, integer, typeofDefaultValue}
    ),
    set: $(_ + 'create/methods/entity-primitive')(
      {...args, integer, typeofDefaultValue}
    ),
    enumerable: true
  }
}
