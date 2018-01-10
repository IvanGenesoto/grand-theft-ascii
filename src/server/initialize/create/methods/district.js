module.exports = function createInitializedDistrictMethods({_district, $}) {

  const {id, status, blueprints: _blueprints} = _district

  const statusAccessor = Object.freeze({
    get: () => status,
    set: (value) => (_district.status = value)
  })

  const blueprintsAccessor = Object.freeze({
    get: (strata, layer, row, column) => _blueprints[strata][layer][row][column],
    set(strata, layer, row, column, value) {
      _blueprints[strata][layer][row][column] = value
    }
  })

  return {

    id,

    get status() { return statusAccessor },

    get blueprints() { return blueprintsAccessor }
  }
}
