export const control = function ({key}) {
  const {state, isDown} = this
  const {player} = state
  const {input} = player
  if (key === 'a' || key === 'A' || key === 'ArrowLeft') isDown
    ? input.left = true
    : input.left = false
  if (key === 'd' || key === 'D' || key === 'ArrowRight') isDown
    ? input.right = true
    : input.right = false
  if (key === 'w' || key === 'W' || key === 'ArrowUp') isDown
    ? input.up = true
    : input.up = false
  if (key === 's' || key === 'S' || key === 'ArrowDown') isDown
    ? input.down = true
    : input.down = false
  if (key === ' ' || key === 'Enter') isDown
    ? input.action = true
    : input.action = false
}
