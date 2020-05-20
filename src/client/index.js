const socket = require('socket.io-client')()
const client = Object.create(null)

window.createPlayer = name => socket.emit('create_player', name)

window.logIn = token => socket.emit('log_in', token)

window.sendInput = input => socket.emit('input', input)

socket.on('district_id', districtID => {
  const token = localStorage.getItem('token')
  if (token) return socket.emit('log_in', token)
  const name = prompt(`Welcome to Anarch City, District ${districtID}. What's your name?`)
  socket.emit('create_player', name)
})

socket.on('invalid_name', () => {
  const name = prompt('That name is unavailable. Try a different name.')
  socket.emit('create_player', name)
})

socket.on('player', (player, isNew) => {
  const {token, name} = player
  const greeting = isNew ? 'Hello' : 'Welcome back'
  client.player = player
  localStorage.setItem('token', token)
  alert(`${greeting}, ${name}!`)
})

socket.on('invalid_token', districtID => {
  const name = prompt(`Welcome to Anarch City, District ${districtID}. What's your name?`)
  socket.emit('create_player', name)
})

socket.on('player_district_id', districtID => console.log(
  'Log in to district ' + districtID + '.'
))
