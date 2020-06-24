export const handleTimestamp = function (timestamp) {
  const {state, wrappedPlayer} = this
  const {latencyQueue, now} = state
  const newTimestamp = now()
  const latency = newTimestamp - timestamp
  latencyQueue.push({latency, wrappedPlayer})
  return state
}
