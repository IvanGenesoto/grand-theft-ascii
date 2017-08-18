const Players = require('./players-new')
const Districts = require('./districts-new')
const Rooms = require('./rooms-new')
const Chararcters = require('./characters-new')
const Vehicles = require('./vehicles-new')

function retrieveState() {
  // get state from Redis
}

const _state = retrieveState()

const {
  _players,
  _districts,
  _rooms,
  _characters,
  _vehicles
} = _state

const state = {
  players: Players(_players),
  districts: Districts(_districts),
  rooms: Rooms(_rooms),
  characters: Chararcters(_characters),
  vehicles: Vehicles(_vehicles)
}

module.exports = state
