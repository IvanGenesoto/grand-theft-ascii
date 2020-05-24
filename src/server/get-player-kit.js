export const getPlayerKit = function (_players = []) {

  const all = []
  const multiple = []
  const latencies = []

  const createPlayer = () => {
    const input = {
      up: false,
      down: false,
      left: false,
      right: false,
      accelerate: false,
      decelerate: false,
      action: false
    }
    const prototype = {
      id: null,
      status: 'on',
      socketId: null,
      character: null,
      predictionBuffer: [],
      latencyBuffer: [],
      input
    }
    return Object
      .entries(prototype)
      .reduce(appendAttribute, {})
  }

  const appendAttribute = (player, [key, value]) => {
    player[key] =
        Array.isArray(value) ? [...value]
      : value && value === 'object' ? {...value}
      : value
    return player
  }

  const playerKit = {

    create: socketId => {
      const player = createPlayer()
      const playerClone = createPlayer()
      player.socketId = socketId
      player.id = _players.length
      _players.push(player)
      const {id} = player
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
      _players.forEach((unusedItem, id) => {
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

    updateInput: ({input, wrappedPlayerId}) => {
      const {playerId: id} = wrappedPlayerId
      const player = _players[id]
      player && (player.input = input)
    },

    updateLatencyBuffer: ({latency, wrappedPlayerId}) => {
      const {playerId: id} = wrappedPlayerId
      const latencyBuffer = _players[id].latencyBuffer
      latencyBuffer.push(latency)
      latencyBuffer.length > 20 && latencyBuffer.shift()
    },

    getLatencies: () => {
      latencies.length = 0
      _players.forEach(player => {
        const {status, character, id} = player
        if (status !== 'on') return
        latencies.push(character)
        latencies.push(playerKit.getLatency(id))
      })
      return latencies
    },

    getLatency: id => {
      const player = _players[id]
      const {latencyBuffer} = player
      const {length} = latencyBuffer
      const total = latencyBuffer.reduce((total, latency) => total + latency, 0)
      return total / length
    }
  }

  return playerKit
}
