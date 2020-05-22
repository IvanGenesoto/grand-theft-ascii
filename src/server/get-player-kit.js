export const getPlayerKit = function (_players = []) {

  const all = []

  const multiple = []

  const latencies = []

  function createPlayer() {

    const playerPrototype = {
      id: undefined,
      status: 'on',
      socket: undefined,
      character: null,
      predictionBuffer: [],
      latencyBuffer: [],
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

    var player = {...playerPrototype}

    for (var property in playerPrototype) {
      var value = playerPrototype[property]
      if (Array.isArray(value)) player[property] = [...value]
      else if (typeof value === 'object' && value !== null) {
        for (var nestedProperty in value) {
          var nestedValue = value[nestedProperty]
          if (typeof nestedValue !== 'object' || nestedValue === null) {
            player[property][nestedProperty] = nestedValue
          }
          else player[property][nestedProperty] = null
        }
      }
    }

    return player
  }

  const players = {

    create: socketId => {

      var player = createPlayer()
      var playerClone = createPlayer()

      player.socket = socketId

      player.id = _players.length
      _players.push(player)

      const id = player.id
      players[id] = playerClone
      players.clone(id)
      players.refreshLength()

      return id
    },

    clone: id => {
      const playerClone = players[id]
      const player = _players[id]

      for (var property in player) {
        var value = player[property]
        if (typeof value !== 'object' || value === null) {
          playerClone[property] = value
        }
        else if (Array.isArray(value)) {
          playerClone[property].length = 0
          value.forEach(item => playerClone[property].push(item))
        }
        else if (typeof value === 'object' && value !== null) {
          for (var nestedProperty in value) {
            var nestedValue = value[nestedProperty]
            if (typeof nestedValue !== 'object' || nestedValue === null) {
              playerClone[property][nestedProperty] = nestedValue
            }
          }
        }
      }

      players[id] = playerClone
      return playerClone
    },

    cloneMultiple: (...idArrays) => {
      multiple.length = 0
      if (idArrays.length) {
        idArrays.forEach(idArray => {
          if (idArray) {
            idArray.forEach(id => {
              if (id) {
                var playerClone = players.clone(id)
                multiple.push(playerClone)
              }
            })
          }
        })
      }
      return multiple
    },

    cloneAll: () => {
      all.length = 0
      _players.forEach((item, id) => {
        var player = players.clone(id)
        all.push(player)
      })
      return all
    },

    assignCharacter: (playerId, characterId) => {
      _players[playerId].character = characterId
      players[playerId].character = characterId
    },

    getPlayerCharacterIds: () => {
      return _players.map(player => player.character)
    },

    getPlayerIdBySocketId: socketId => {
      var player = _players.find(player => (player.socket === socketId))
      return player.id
    },

    refreshLength: () => {
      players.length = _players.length
    },

    emit: (playerId, socket) => socket.emit('player', _players[playerId]),

    updateInput: (input, playerId) => {
      var player = _players[playerId]
      player.input = input
    },

    updateLatencyBuffer: (id, latency) => {
      var latencyBuffer = _players[id].latencyBuffer
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
      var player = _players[id]
      var latencyBuffer = player.latencyBuffer
      var total = latencyBuffer.reduce((total, latency) => total + latency, 0)
      return total / latencyBuffer.length
    }
  }

  return players
}
