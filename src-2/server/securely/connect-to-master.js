const $ = require
const socket = $('socket.io-client')()
const credentials = $('./credentials')

socket.emit('credentials', credentials)
socket.on('confirmed_server', message => {
  console.log(message)
})

module.exports = socket
