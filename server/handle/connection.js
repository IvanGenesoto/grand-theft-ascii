import {handleTimestamp, handleInput} from '.'

export const handleConnection = function (socket) {

  const {state} = this
  const {connectionQueue} = state
  const wrappedPlayer = {}

  connectionQueue.push({socket, wrappedPlayer})
  socket.on('timestamp', handleTimestamp.bind({state, wrappedPlayer}))
  socket.on('input', handleInput.bind({state, wrappedPlayer}))

  return state
}
