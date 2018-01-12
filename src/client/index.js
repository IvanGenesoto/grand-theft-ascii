const socket = require('socket.io-client')()

const client = Object.create(null)

window.createPlayer = token => socket.emit('create_player', token)

window.logIn = token => socket.emit('log_in', token)

window.sendInput = input => socket.emit('input', input)

socket.on('district_id', districtID => console.log(
  'Welcome to Anarch City, district ' + districtID + '.'
))

socket.on('player', player => (client.player = player))

socket.on('invalid_token', () => console.log('Invalid token.'))

socket.on('player_district_id', districtID => console.log(
  'Log in to district ' + districtID + '.'
))
