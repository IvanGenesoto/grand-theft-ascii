const Players = require('./players')
const Districts = require('./districts')
const Rooms = require('./rooms')
const Chararcters = require('./characters')
const Vehicles = require('./vehicles')

function retrieveState() {
  // get state from Redis
}

const _state = retrieveState()

if (_state) {
  var {
    _players,
    _districts,
    _rooms,
    _characters,
    _vehicles
  } = _state
}

const state = {
  players: Players(_players),
  districts: Districts(_districts),
  rooms: Rooms(_rooms),
  characters: Chararcters(_characters),
  vehicles: Vehicles(_vehicles)
}

module.exports = state
