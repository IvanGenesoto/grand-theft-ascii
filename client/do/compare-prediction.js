export const comparePrediction = ({index, state}) => {

  if (index === -1) return {index: 0, state}

  const {predictionBuffer, player, entitiesByType} = state
  const {characters} = entitiesByType
  const {characterId} = player
  const character = characters[characterId]
  const prediction = predictionBuffer[index]
  const {x, maxSpeed} = character || {}
  const {x: x_} = prediction || {}
  const didPredict = Math.abs(x - x_) <= maxSpeed

  return {didPredict, index, state}
}
