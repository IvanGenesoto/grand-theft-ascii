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

  const $ = require

  const playersPrototype = $('./entities-prototype')(_players)

  return Object.create(playersPrototype)
}
