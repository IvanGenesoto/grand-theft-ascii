module.exports = function connect(socket, players) {

  console.log('connected to socket')
  socket.emit('connected', 'connected to io')

  let player

  socket.on('player', id => {
    player = players[id]
  })

  const {playerInput} = player // eslint-disable-line no-unused-vars

  socket.on('input', input => playerInput = input) // eslint-disable-line
}
