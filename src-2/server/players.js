const Entities = require('./entities')

module.exports = function Players(
  _players = {
    status: ['on'],
    socket: [''],
    character: [0],
    predictionBuffer: [undefined],
    latencyBuffer: [[0.1]],
    up: [false],
    down: [false],
    left: [false],
    right: [false],
    accelerate: [false],
    decelerate: [false],
    enter: [false],
    exit: [false]
  }
) {
  const players = Entities(_players)
  return Object.freeze(Object.create(players))
}
