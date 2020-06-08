export const walk = function (character) {
  const {_players} = this
  const {playerId, direction, maxSpeed} = character
  const player = _players[playerId]
  const {input} = player
  const {right, left} = input
  character.speed = right || left ? maxSpeed : 0
  character.direction =
      right ? 'right'
    : left ? 'left'
    : direction
  return character
}
