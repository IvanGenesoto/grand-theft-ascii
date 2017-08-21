module.exports = function getState(districtID) {

  const $ = require
  const isMaster = districtID === 1
  const _retrievedState = $('./retrieve-state') || {}

  const {
    _records = {},
    _districtsEntities = [{}] // districts' entities = [ { [], [], etc. }, { [], [] }, etc. ]
  } = _retrievedState

  const {
  _entityIndexes = $('./create-record'), // entity indexes for district, used by standard servers
  _entityDistricts = $('./create-record'), // which district each entity is in (determines next id)
  _entityCounts = $('./create-record') // how many entities of that type are in each district
} = _records

  const _entities = _districtsEntities[districtID] || {}

  if (isMaster) {
    var Master = $('./create-master')(_entityDistricts, _entityCounts)
    Master.getNextID = $('./get-next-id')(_entityDistricts, _entityCounts)
  }

  const _state = {
    _entityIndexes,
    _entities,
    Master
  }

  return _state
}
