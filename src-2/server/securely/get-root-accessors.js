module.exports = function getRootAccessors(districtID, io) {

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
    _players = $('./default/players'),
    _characters = $('./default/characters'),
    _vehicles = $('./default/vehicles'),
    _rooms = $('./default/rooms')
  } = _entities

  const getNextID = isMaster
    ? Master.getNextID
    : $('./define-get-next-id')(socket)

  const rootAccessors = {
    players: $('./create/root-accessor')(_players, _playerIndexes, getNextID, io),
    characters: $('./create/root-accessor')(_characters, _characterIndexes, getNextID, io),
    vehicles: $('./create/root-accessor')(_vehicles, _vehicleIndexes, getNextID, io),
    rooms: $('./create/root-accessor')(_rooms, _roomIndexes, getNextID, io)
  }

  return {
    rootAccessors,
    Master
  }
}
