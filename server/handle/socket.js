import {handleTimestamp} from '..'

export const handleSocket = function (socket) {

  const {state, isProduction} = this
  const {connectionQueue, noTokenQueue, tokenQueue, inputQueue} = state
  const wrappedPlayer = {}

  isProduction || console.log('connected to socket ' + socket.id.slice(-4))
  connectionQueue.push(socket)
  socket.on('no_token', () => noTokenQueue.push(socket, wrappedPlayer))
  socket.on('token', token => tokenQueue.push({token, socket, wrappedPlayer}))
  socket.on('timestamp', handleTimestamp.bind({state, wrappedPlayer}))
  socket.on('input', input => inputQueue.push({input, wrappedPlayer}))

  return state
}
