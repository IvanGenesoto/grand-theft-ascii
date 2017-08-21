module.exports = function defineGetNextID(_entityDistricts, _entityCounts) {

  return function getNextID(entityType, districtID) {
    const index = _entityDistricts[entityType].length
    _entityDistricts[entityType][index] = districtID
    _entityCounts[entityType][districtID] += 1
    return index
  }
}
