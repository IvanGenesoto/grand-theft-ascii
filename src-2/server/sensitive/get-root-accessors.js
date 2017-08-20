module.exports = function getRootAccessors(districtID) {

  const $ = require
  const isMaster = districtID === 1
  const socket = isMaster
    ? undefined
    : $('./connect-to-master')

  const _state = isMaster
    ? $('./master/get-state')(districtID)
    : $('./request-state')(districtID, socket)

  const {
    _entityIndexes,
    _entities,
    Master
  } = _state

  const {
    players: _playerIndexes,
    characters: _characterIndexes,
    vehicles: _vehicleIndexes,
    rooms: _roomIndexes
  } = _entityIndexes

  const {
    _players = $('./entities/players'),
    _characters = $('./entities/characters'),
    _vehicles = $('./entities/vehicles'),
    _rooms = $('./entities/rooms')
  } = _entities

  const getNextID = isMaster
    ? Master.getNextID
    : $('./define-get-next-id')(socket)

  const rootAccessors = {
    players: $('./create/root/accessor')(_players, _playerIndexes, getNextID),
    characters: $('./create/root/accessor')(_characters, _characterIndexes, getNextID),
    vehicles: $('./create/root/accessor')(_vehicles, _vehicleIndexes, getNextID),
    rooms: $('./create/root/accessor')(_rooms, _roomIndexes, getNextID),
    Master
  }

  return rootAccessors
}
