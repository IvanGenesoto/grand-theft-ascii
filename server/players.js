var now = require('performance-now')

function Players(_players = []) {

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

  var standIn = Object.assign({}, player)
  var latencies = []
  var characterIDs = []

  var players = {

    characterIDs: characterIDs,

    length: _players.length,

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
        if (typeof value !== 'object' || value === null) standIn[property] = value
        else if (Array.isArray(value)) {
          standIn[property].length = 0
          value.forEach((item, index) => {
            standIn[property][index] = item
          })
        }
        else if (property === 'input') {
          for (var inputProperty in value) {
            var inputValue = value[inputProperty]
            standIn[property][inputProperty] = inputValue
          }
        }
        else standIn[property] = 'Object found in player ' + id + '.'
      }
      return standIn
    },

    getLength: () => _players.length,

    getCharacterIDs: () => [...characterIDs],

    assignCharacter: (playerID, characterID) => {
      _players[playerID - 1].character = characterID
      characterIDs.push(characterID)
      players.characterIDs = players.getCharacterIDs()
    },

    getPlayerIDBySocketID: socketID => {
      var player = _players.find(player => {
        return (player.socket === socketID)
      })
      return player.id
    },

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

    getLatency: id => {
      var player = players[id]
      var latencyBuffer = player.latencyBuffer
      var total = latencyBuffer.reduce((total, latency) => total + latency, 0)
      return total / latencyBuffer.length
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
    }
  }

  return players
}

module.exports = Players
