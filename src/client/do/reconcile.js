import {
  updatePlayerCharacterBehavior,
  updatePlayerCharacterLocation,
  updatePredictionBuffer
} from '../update'

export const reconcilePlayerCharacter = ({didPredict, index, state}) => {
  const {player, predictionBuffer, oldEntitiesByType, entitiesByType} = state
  const {characters} = entitiesByType
  const {characters: oldCharacters} = oldEntitiesByType
  const {characterId} = player
  const character = characters[characterId]
  const oldCharacter = oldCharacters[characterId]
  const {x, direction} = oldCharacter || {}
  const {drivingId} = character
  didPredict && !drivingId && (character.x = x)
  didPredict && !drivingId && (character.direction = direction)
  if (didPredict) return state
  const predictionBuffer_ = predictionBuffer.slice(index)
  predictionBuffer.length = 0
  if (drivingId) return state
  predictionBuffer_.reduce(reconcilePrediction, state)
  return state
}

export const reconcilePrediction = (state, prediction, index) => {
  const {input} = prediction
  index && updatePlayerCharacterBehavior(input, state)
  index && updatePlayerCharacterLocation(state)
  updatePredictionBuffer(input, state)
  return state
}
