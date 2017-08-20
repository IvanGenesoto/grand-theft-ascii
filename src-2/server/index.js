const $ = require
const express = $('express')
const app = express()
const server = $('http').Server(app)
const socket = $('socket.io')
const io = socket(server)
const path = $('path')
const port = process.env.PORT || 3000

const rootAccessors = $('./sensitive/get-root-accessors')(
  $('./sensitive/district-id')
)

const {
  players, // eslint-disable-line no-unused-vars
  districts, // eslint-disable-line no-unused-vars
  rooms, // eslint-disable-line no-unused-vars
  characters, // eslint-disable-line no-unused-vars
  vehicles, // eslint-disable-line no-unused-vars
  Master
} = rootAccessors

io.on('connection', socket => {

  console.log('connected to ' + socket.id)
  socket.emit('connected', 'connected')

  let isServer

  if (Master) {
    socket.on('credentials', credentials => {
      isServer = Master.check(credentials)
      socket.emit('confirmed_server', 'confirmed_server')
    })
  }

  if (Master && isServer) {
    socket.on('request_state', districtID => Master.getState(districtID, socket))
    socket.on('get_next_id', ({entityType, districtID}) => {
      const id = Master.getNextID(entityType, districtID)
      socket.emit('id', id)
    })
  }
})

app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => {
  console.log('Listening on port 3000.')
})
