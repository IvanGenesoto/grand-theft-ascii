import {getLatency} from '..'

export const getLatencyKits = function (player) {

  const {players} = this
  const {status, characterId, id} = player
  const latency = getLatency(id, players)

  return status === 'online' && {characterId, latency}
}
