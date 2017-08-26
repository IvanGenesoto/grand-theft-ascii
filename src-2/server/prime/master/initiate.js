module.exports = function initiate() {

  const $ = require
  const _retrievedState = $('./retrieve-state') || {}

  const {
    _records = {},
    _districtEntities = [{}] // districts' entities = [ { [], [], etc. }, { [], [] }, etc. ]
  } = _retrievedState

  var Master = $('./create')(_entityIndexes, _entityDistricts, _entityCounts, _records = {})

  const _state = {
    _entityIndexes,
    _entities,
    Master
  }

  return _state
}

// const {
// _entityIndexes = $('./create-record'), // entity indexes for district, used by standard servers
// _entityDistricts = $('./create-record'), // which district each entity is in (determines next id)
// _entityCounts = $('./create-record') // how many entities of that type are in each district
// } = _records
//
// const _entities = _districtEntities[districtID] || {}
