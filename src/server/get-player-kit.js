export const getPlayerKit = function () {

  const createPlayer = () => {
    const input = {
      up: false,
      down: false,
      left: false,
      right: false,
      action: false
    }
    const prototype = {
      id: null,
      status: 'online',
      socketId: null,
      characterId: null,
      previousAction: false,
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

    create: (_players, socketId) => {
      const player = createPlayer()
      player.socketId = socketId
      const id = player.id = _players.length
      _players.push(player)
      return id
    },

    assignCharacter: (playerId, characterId, _players) => {
      const player = _players[playerId]
      player.characterId = characterId
      return _players
    },

    getPlayerCharacterIds: _players => _players.map(player => player.characterId),

    setPreviousAction: (action, id, _players) => _players[id].previousAction = action,

    emit: (playerId, socket, _players) => socket.emit('player', _players[playerId]),

    updateInput: function ({input, wrappedPlayerId}) {
      const {state} = this
      const {entityKit, _players, _entities} = state
      const {playerId: id} = wrappedPlayerId
      const player = _players[id]
      const {characterId} = player
      const {tick} = input
      entityKit.handleTick(tick, characterId, _entities)
      player && (player.input = input)
    },

    updateLatencyBuffer({latency, wrappedPlayerId}) {
      const {state} = this
      const {_players} = state
      const {playerId: id} = wrappedPlayerId
      const player = _players[id]
      const {latencyBuffer} = player
      latencyBuffer.push(latency)
      latencyBuffer.length > 20 && latencyBuffer.shift()
    },

    getLatencyKits: _players => {
      return _players.map(player => {
        const {status, characterId, id} = player
        const latency = playerKit.getLatency(id, _players)
        if (status !== 'online') return
        return {characterId, latency}
      })
    },

    getLatency: (id, _players) => {
      const player = _players[id]
      const {latencyBuffer} = player
      const {length} = latencyBuffer
      const total = latencyBuffer.reduce((total, latency) => total + latency, 0)
      return total / length
    }
  }

  return playerKit
}
