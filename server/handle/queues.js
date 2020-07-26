import {initiatePlayer, handleToken, updateLatencyBuffer, updateInput} from '..'

export const handleQueues = function () {

  const {state} = this
  const {connectionQueue, noTokenQueue, tokenQueue, latencyQueue, inputQueue} = state

  connectionQueue.forEach(socket => socket.emit('request_token'))
  noTokenQueue.forEach(initiatePlayer, this)
  tokenQueue.forEach(handleToken, this)
  latencyQueue.forEach(updateLatencyBuffer)
  inputQueue.forEach(updateInput, this)
  connectionQueue.length = 0
  noTokenQueue.length = 0
  tokenQueue.length = 0
  latencyQueue.length = 0
  inputQueue.length = 0

  return state
}
