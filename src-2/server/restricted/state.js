function retrieveState() {
  // get state from Redis
  const state = {}
  return state
}

const _state = retrieveState()

const {
  _players,
  _districts,
  _rooms,
  _characters,
  _vehicles
} = _state

const $ = require

const state = {
  players: $('../players')($('./players')(_players)),
  districts: $('../districts')($('./districts')(_districts)),
  rooms: $('../rooms')($('./rooms')(_rooms)),
  characters: $('../characters')($('./characters')(_characters)),
  vehicles: $('../vehicles')($('./vehicles')(_vehicles))
}

module.exports = state
