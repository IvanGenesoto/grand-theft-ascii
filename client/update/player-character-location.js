export const updatePlayerCharacterLocation = (state) => {
  const {player, city, entitiesByType} = state
  const {characters} = entitiesByType
  const {characterId} = player
  const character = characters[characterId]
  const {x, speed, direction, width} = character
  const maxX = city.width - width
  if (speed <= 0) return state
  character.x = direction === 'left' ? x - speed : x + speed
  character.x < 0 && (character.x = 0)
  character.x > maxX && (character.x = maxX)
}
