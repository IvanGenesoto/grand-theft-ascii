module.exports = function requestState(districtID, socket) {
  const _container = Object.create(null)
  socket.emit('request_state', districtID)
  socket.on('state', _state => {
    Object.defineProperties(_container, {_state: {value: _state}})
  })
  const _state = _container._state
  return _state
}
