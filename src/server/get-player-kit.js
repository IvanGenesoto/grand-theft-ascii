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
      player.id = _players.length
      _players.push(player)
      return player
    },

    getPlayerCharacterIds: _players => _players.map(player => player.characterId),

    setPreviousAction: (action, id, _players) => _players[id].previousAction = action,

    updateInput: function ({input, wrappedPlayer}) {
      const {state} = this
      const {entityKit, _entities} = state
      const {player} = wrappedPlayer
      const {characterId} = player
      const {tick} = input
      entityKit.handleTick(tick, characterId, _entities)
      player && (player.input = input)
    },

    updateLatencyBuffer({latency, wrappedPlayer}) {
      const {player} = wrappedPlayer
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
