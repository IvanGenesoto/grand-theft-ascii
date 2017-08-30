module.exports = function createPropertyDescriptor(args) {

  const {_defaultValue, $, _} = args

  const defaultValue = _defaultValue[0]
  const typeofDefaultValue = typeof defaultValue
  const noBoolean = true
  $(_ + 'filter/typeof-default-value')(
    {...args, defaultValue, typeofDefaultValue, noBoolean}
  )

  const integer = Number.isInteger(defaultValue)
  const idCashe = Object.create(null)

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
