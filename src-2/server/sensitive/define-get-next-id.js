module.exports = function defineGetNextID(socket) {

  return function getNextID(entityType, districtID) {
    let id
    socket.emit('get_next_id', {entityType, districtID})
    socket.on('id', receivedID => {
      id = receivedID
    })
    return id
  }
}
