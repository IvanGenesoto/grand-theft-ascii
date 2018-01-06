module.exports = function connect(socket, players, now) {

  const {districtID} = players

  console.log('connected to socket: ' + socket.id)
  socket.emit('district_id', districtID)

  let player

  socket.on('create_player', attributes => {
    player = players.create()
    player.customize(attributes)
    socket.emit('player_id', player.id)
  })

  socket.on('login', token => {
    const id = players.retrieveDistrictID(token)
    if (!id) socket.emit('invalid_token')
    else if (id !== districtID) socket.emit('player_district_id,', id)
    else {
      player = players.retrievePlayer(token)
      socket.emit(player.id)
    }
  })

  socket.on('timestamp', timestamp => {
    const newTimestamp = now()
    const latency = newTimestamp - timestamp
    player.updateLatencyBuffer(latency)
  })

  socket.on('input', input => player.input.set()) // eslint-disable-line no-return-assign
}
