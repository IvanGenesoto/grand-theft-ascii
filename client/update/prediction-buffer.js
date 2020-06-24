export const updatePredictionBuffer = (input, state) => {
  const {player, entitiesByType, predictionBuffer} = state
  const {characters} = entitiesByType
  const {characterId} = player
  const character = characters[characterId]
  const {tick} = input || {}
  const {x} = character
  const prediction = {x, tick, input}
  predictionBuffer.push(prediction)
  predictionBuffer.length > 60 && predictionBuffer.shift()
}
