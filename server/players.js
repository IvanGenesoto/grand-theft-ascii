var now = require('performance-now')

function Players(_players = [], _playerCharacterIDs = []) {

  var player = {
    id: undefined,
    status: 'on',
    predictionBuffer: [],
    latencyBuffer: [],
    character: null,
    input: {
      up: false,
      down: false,
      left: false,
      right: false,
      accelerate: false,
      decelerate: false,
      action: false
    }
  }

  var standInPlayer = {
    predictionBuffer: [],
    latencyBuffer: [],
    input: {}
  }
  var standInPlayerCharacterIDs = []

  var latencies = []

  var players = {

    playerCharacterIDs: standInPlayerCharacterIDs,

    create: (socketID) => {

      player = Object.assign({}, player)
      player.socket = socketID

      _players.push(player)
      player.id = _players.length

      players[player.id] = players.get(player.id)
      players.length = players.getLength()

      return player.id
    },

    get: id => {
      var player = _players[id - 1]
      for (var property in player) {
        var value = player[property]
        if (typeof value !== 'object' || value === null) standInPlayer[property] = value
        else if (Array.isArray(value)) {
          standInPlayer[property].length = 0
          value.forEach((item, index) => {
            standInPlayer[property][index] = item
          })
        }
        else if (property === 'input') {
          for (var inputProperty in value) {
            var inputValue = value[inputProperty]
            standInPlayer[property][inputProperty] = inputValue
          }
        }
        else standInPlayer[property] = 'Object found in player ' + id + '.'
      }
      return standInPlayer
    },

    refresh: () => {
      var id = 1
      while (id <= _players.length) {
        players[id] = players.get(id)
        id++
      }
    },

    refreshPlayerCharacterIDs: () => {
      standInPlayerCharacterIDs.length = 0
      _playerCharacterIDs.forEach(item => {
        standInPlayerCharacterIDs.push(item)
      })
    },

    assignCharacter: (playerID, characterID) => {
      _players[playerID - 1].character = characterID
      _playerCharacterIDs[playerID - 1] = characterID
      standInPlayerCharacterIDs[playerID - 1] = characterID
    },

    getPlayerIDBySocketID: socketID => {
      var player = _players.find(player => {
        return (player.socket === socketID)
      })
      return player.id
    },

    getLength: () => _players.length,

    emit: (playerID, socket) => socket.emit('player', _players[playerID - 1]),

    updateInput: (input, playerID) => {
      var player = _players[playerID - 1]
      player.input = input
    },

    updateLatencyBuffer: (id, timestamp) => {
      var newTimestamp = now()
      var latency = (newTimestamp - timestamp)
      var latencyBuffer = _players[id - 1].latencyBuffer
      latencyBuffer.push(latency)
      if (latencyBuffer.length > 20) latencyBuffer.shift()
    },

    getLatencies: () => {
      latencies.length = 0
      _players.forEach(player => {
        if (player.status === 'on') {
          latencies.push(player.character)
          latencies.push(players.getLatency(player.id))
        }
      })
      return latencies
    },

    getLatency: id => {
      var player = _players[id - 1]
      var latencyBuffer = player.latencyBuffer
      var total = latencyBuffer.reduce((total, latency) => total + latency, 0)
      return total / latencyBuffer.length
    }
  }

  return players
}

module.exports = Players
