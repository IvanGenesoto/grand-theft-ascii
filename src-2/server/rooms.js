const Entities = require('./entities')

module.exports = function Rooms(
  _rooms = {
    status: ['locked'],
    name: ['Pad'],
    district: [0],
    zone: [0],
    capacity: [50],
    occupants: [[0]],
    masterKeyHolders: [[0]],
    keyHolders: [[0]],
    unwelcomes: [[0]],
    x: [0.1],
    y: [0.1],
    width: [0],
    height: [0],
    element: ['canvas'],
    background: [0],
    foreground: [0],
    inventory: [[0]]
  }
) {
  const rooms = Entities(_rooms)
  return Object.freeze(Object.create(rooms))
}
