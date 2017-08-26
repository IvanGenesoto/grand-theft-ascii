const $ = require
const express = $('express')
const app = express()
const server = $('http').Server(app)
const socket = $('socket.io')
const io = socket(server)

const district = $('./prime')(io, $)

$('./initiate')(district)

const {players} = district

io.on('connection', socket => $('./connect')(socket, players))

const path = $('path')
const port = process.env.PORT || 3000
app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => console.log('Listening on port ' + port))
