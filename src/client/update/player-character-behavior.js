export const updatePlayerCharacterBehavior = (input, state) => {
  const {player, entitiesByType} = state
  const {characters} = entitiesByType
  const {characterId} = player
  const character = characters[characterId]
  const {direction, maxSpeed} = character
  const {left, right} = input
  character.speed = left || right ? maxSpeed : 0
  character.direction =
      right ? 'right'
    : left ? 'left'
    : direction
}
