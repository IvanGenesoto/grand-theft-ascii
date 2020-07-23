export const getLatency = (id, _players) => {

  const player = _players[id]
  const {latencyBuffer} = player
  const {length} = latencyBuffer
  const total = latencyBuffer.reduce((total, latency) => total + latency, 0)

  return total / length
}
