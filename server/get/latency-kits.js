import {getLatency} from '..'

export const getLatencyKits = function (player) {

  const {_players} = this
  const {status, characterId, id} = player
  const latency = getLatency(id, _players)

  return status === 'online' && {characterId, latency}
}
