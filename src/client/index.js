const $ = require
const socket = $('socket.io-client')()

socket.on('connected', message => console.log(message))
