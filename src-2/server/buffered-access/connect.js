module.exports = function connect(socket, players) {

  console.log('connected to socket')
  socket.emit('connected', 'connected to io')

  let player

  socket.on('player', id => {
    player = players[id]
  })

  socket.on('input', input => player.input = input) // eslint-disable-line no-return-assign
}
