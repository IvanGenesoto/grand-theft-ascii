export const getPlayerKit = function (_players = []) {

  const all = []

  const multiple = []

  const latencies = []

  function createPlayer() {

    const playerPrototype = {
      id: undefined,
      status: 'on',
      socketId: undefined,
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

  const playerKit = {

    create: socketId => {

      var player = createPlayer()
      var playerClone = createPlayer()

      player.socketId = socketId

      player.id = _players.length
      _players.push(player)

      const id = player.id
      playerKit[id] = playerClone
      playerKit.clone(id)
      playerKit.refreshLength()

      return id
    },

    clone: id => {
      const playerClone = playerKit[id]
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

      playerKit[id] = playerClone
      return playerClone
    },

    cloneMultiple: (...idArrays) => {
      multiple.length = 0
      if (idArrays.length) {
        idArrays.forEach(idArray => {
          if (idArray) {
            idArray.forEach(id => {
              if (id) {
                var playerClone = playerKit.clone(id)
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
        var player = playerKit.clone(id)
        all.push(player)
      })
      return all
    },

    assignCharacter: (playerId, characterId) => {
      _players[playerId].character = characterId
      playerKit[playerId].character = characterId
    },

    getPlayerCharacterIds: () => {
      return _players.map(player => player.character)
    },

    refreshLength: () => {
      playerKit.length = _players.length
    },

    emit: (playerId, socket) => socket.emit('player', _players[playerId]),

    updateInput: (input, playerId) => {
      const player = _players[playerId]
      player && (player.input = input)
    },

    updateLatencyBuffer: (latency, id) => {
      var latencyBuffer = _players[id].latencyBuffer
      latencyBuffer.push(latency)
      if (latencyBuffer.length > 20) latencyBuffer.shift()
    },

    getLatencies: () => {
      latencies.length = 0
      _players.forEach(player => {
        if (player.status === 'on') {
          latencies.push(player.character)
          latencies.push(playerKit.getLatency(player.id))
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

  return playerKit
}
