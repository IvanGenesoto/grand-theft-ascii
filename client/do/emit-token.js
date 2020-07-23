export const emitToken = function () {

  const {state, socket} = this
  const {player} = state
  const {token} = player

  socket.emit('token', token)
}
