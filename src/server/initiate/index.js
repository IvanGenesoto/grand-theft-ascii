module.exports = function initiateDistrict(district) {

  const {players, characters, vehicles, rooms, $, io, now, handleSocket} = district // eslint-disable-line no-unused-vars

  io.on('connection', socket => handleSocket(socket, players, now))
}
