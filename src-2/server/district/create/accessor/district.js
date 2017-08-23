module.exports = function createDistrictAccessor(io) {

  const $ = require
  const isMaster = districtID === 1
  const socket = isMaster
    ? undefined
    : $('./connect-to-master')

  const _state = isMaster
    ? $('./master/get-state')(districtID)
    : $('./request-state')(districtID, socket)

  let {
    _allEntityIndexes,
    _allEntities,
    Master
  } = _state

  const accessorPrototype = $('../../create/accessor/prototype')(_entities) // use .map

  let {
    players: _playerIndexes,
    characters: _characterIndexes,
    vehicles: _vehicleIndexes,
    rooms: _roomIndexes
  } = _allEntityIndexes

  let {
    _players = $('./access/default/players'),
    _characters = $('./access/default/characters'),
    _vehicles = $('./access/default/vehicles'),
    _rooms = $('./access/default/rooms')
  } = _entities

  const getNextID = isMaster
    ? Master.getNextID
    : $('./define-get-next-id')(socket)

  let rootAccessors = {
    players: $('./create/root-accessor')(_players, _playerIndexes, getNextID),
    characters: $('./create/root-accessor')(_characters, _characterIndexes, getNextID),
    vehicles: $('./create/root-accessor')(_vehicles, _vehicleIndexes, getNextID),
    rooms: $('./create/root-accessor')(_rooms, _roomIndexes, getNextID)
  }``````
}
