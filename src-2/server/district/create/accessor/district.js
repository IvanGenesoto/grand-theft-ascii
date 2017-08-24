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

  const allRootAccessors = $('./create/accessor/all-roots')(
    {_allEntities, _allEntityIndexesByID, districtID, getNextID, district}
  )
}
