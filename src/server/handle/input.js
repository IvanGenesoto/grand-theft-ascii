export const handleInput = function (input) {
  const {state, wrappedPlayer} = this
  const {inputQueue} = state
  inputQueue.push({input, wrappedPlayer})
  return state
}
