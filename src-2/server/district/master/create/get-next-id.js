module.exports = function createGetNextID(_entityDistricts, _entityCounts) {

  function getNextID(entityType, districtID) {
    const id = _entityDistricts[entityType].length
    _entityDistricts[entityType][id] = districtID
    _entityCounts[entityType][districtID] += 1
    return id
  }

  return getNextID
}
