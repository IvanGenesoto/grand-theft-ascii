export const updateLatencyBuffer = ({latency, wrappedPlayer}) => {
  const {player} = wrappedPlayer
  const {latencyBuffer} = player
  latencyBuffer.push(latency)
  latencyBuffer.length > 20 && latencyBuffer.shift()
}
