export const getLatency = (id, players) => {

  const player = players[id]
  const {latencyBuffer} = player
  const {length} = latencyBuffer
  const total = latencyBuffer.reduce((total, latency) => total + latency, 0)

  return total / length
}
