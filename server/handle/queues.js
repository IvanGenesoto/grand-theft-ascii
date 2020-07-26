import {initiatePlayer, updateLatencyBuffer, updateInput} from '..'

export const handleQueues = function () {

  const {state} = this
  const {connectionQueue, latencyQueue, inputQueue} = state

  connectionQueue.forEach(initiatePlayer, this)
  latencyQueue.forEach(updateLatencyBuffer)
  inputQueue.forEach(updateInput, this)
  connectionQueue.length = 0
  latencyQueue.length = 0
  inputQueue.length = 0

  return state
}
