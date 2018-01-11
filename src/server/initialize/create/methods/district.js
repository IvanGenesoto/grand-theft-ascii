module.exports = function createInitializedDistrictMethods({_district, $}) {

  const {id, statusCode, blueprints: _blueprints} = _district

  const statusCodeAccessor = Object.freeze({
    get: () => statusCode,
    set: (value) => (_district.statusCode = value)
  })

  const blueprintsAccessor = Object.freeze({
    get: (strata, layer, row, column) => _blueprints[strata][layer][row][column],
    set(strata, layer, row, column, value) {
      _blueprints[strata][layer][row][column] = value
    }
  })

  return {

    id,

    get statusCode() { return statusCodeAccessor },

    get blueprints() { return blueprintsAccessor }
  }
}
