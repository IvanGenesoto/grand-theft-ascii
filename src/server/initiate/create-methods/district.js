module.exports = function createDistrictMethods(district) {

  const {players, characters, vehicles, rooms} = district // eslint-disable-line no-unused-vars

  return Object.freeze({

    generateToken() {
      const characterString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const {length} = characterString
      let count = 16
      let token = ''
      while (count) {
        const random = Math.random()
        const float = length * random
        const index = Math.floor(float)
        const character = characterString.charAt(index)
        token += character
        --count
      }
      return token
    },

    handle(socket) {
      const {generateToken} = district
      const {districtID} = players
      const socketID = socket.id
      const socketIndex = socketID.slice(-4)
      console.log('connected to socket ' + socketIndex)
      socket.emit('district_id', districtID)
      let player
      socket.on('create_player', name => {
        if (!name) return socket.emit('invalid_name')
        const name_ = '' + name
        player = players.create()
        player.socket.set(socketID)
        player.token.set(generateToken())
        player.name.set(name_)
        socket.emit(
          'player',
          {token: player.token.get(), name: player.name.get()},
          true
        )
      })
      socket.on('log_in', token => {
        const {districtID} = players
        const playerID = players.getIDWithAttribute('token', token)
        if (!playerID) return socket.emit('invalid_token', districtID)
        player = players[playerID]
        const {districtID: playerDistrictID} = player
        if (playerDistrictID !== districtID) {
          return socket.emit('player_district_id', playerDistrictID)
        }
        player.socket.set(socketID)
        socket.emit(
          'player',
          {token: player.token.get(), name: player.name.get()}
        )
      })
      socket.on('input', input => player.input.set(input))
    }
  })
}
