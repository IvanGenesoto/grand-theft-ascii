module.exports = function connection(io, Master) {

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
}
