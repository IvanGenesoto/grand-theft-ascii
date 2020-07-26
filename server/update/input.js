export const updateInput = function ({input, wrappedPlayer}) {

  const {state} = this
  const {characters} = state
  const {player} = wrappedPlayer
  const {characterId} = player
  const {tick} = input
  const character = characters[characterId]

  character.tick = tick
  player && (player.input = input)
}
