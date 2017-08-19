module.exports = function State(district) {

  const $ = require

  function requestState(district) { /* request state from master server via socket.io */ }

  const _state = district === 1
    ? $('./master/state')(district)
    : requestState(district)

  const {
    _entityCounts,
    _entityDistricts,
    _entityIndexes,
    _entities
  } = _state

  const {
    _players,
    _districts,
    _rooms,
    _characters,
    _vehicles
  } = _entities || {}

  const entities = Object.freeze(Object.create(null, {
    players: {value: $('./prime/players')(_players)},
    districts: {value: $('./prime/districts')(_districts)},
    rooms: {value: $('./prime/rooms')(_rooms)},
    characters: {value: $('./prime/characters')(_characters)},
    vehicles: {value: $('./prime/vehicles')(_vehicles)}
  }))

  return entities
}
