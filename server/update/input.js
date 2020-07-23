export const updateInput = function ({input, wrappedPlayer}) {

  const {state} = this
  const {_characters} = state
  const {player} = wrappedPlayer
  const {characterId} = player
  const {tick} = input
  const character = _characters[characterId]

  character.tick = tick
  player && (player.input = input)
}
