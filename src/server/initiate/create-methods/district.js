module.exports = function createDistrictMethods(district) {

  const {players, characters, vehicles, rooms, initiate} = district // eslint-disable-line no-unused-vars

  return Object.freeze({
    handleSocket(socket, players, now) {

      const {districtID} = players
      const socketID = socket.id
      const socketIndex = socketID.slice(-4)
      console.log('connected to socket ' + socketIndex)
      socket.emit('district_id', districtID)

      let player

      socket.on('create_player', token => {
        player = players.create()
        player.socket.set(socketID)
        player.token.set(token)
        socket.emit('player', player)
      })

      socket.on('log_in', token => {
        const playerID = players.retrievePlayerID(token)
        if (!playerID) return socket.emit('invalid_token')
        const playerDistrictID = players.retrieveDistrictID(playerID)
        if (playerDistrictID !== districtID) {
          return socket.emit('player_district_id', playerDistrictID)
        }
        player = players[playerID]
        player.socket.set(socketID)
        socket.emit('player', player)
      })

      socket.on('input', input => player.input.set(input))
    }
  })
}
