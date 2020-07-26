export const walk = function (character) {

  const {players} = this
  const {playerId, direction, maxSpeed} = character
  const player = players[playerId]
  const {input} = player
  const {right, left} = input

  character.speed = right || left ? maxSpeed : 0

  character.direction =
      right ? 'right'
    : left ? 'left'
    : direction

  return character
}
