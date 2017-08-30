const $ = require
const express = $('express')
const app = express()
const server = $('http').Server(app)
const path = $('path')
const port = process.env.PORT || 3000
const socket = $('socket.io')
const io = socket(server)
const redis = null

let _ = './raw-access/'
const city = $(_ + 'create/accessor/city')(redis, $, _)
$(_ + 'initiate')(city)
const district = $(_ + 'create/accessor/district')(city, $, _)

_ = './buffered-access/'
$(_ + 'initiate')(district, $, _)
const {players} = district

io.on('connection', socket => $(_ + 'connect')(socket, players))
app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => console.log('Listening on port ' + port))
