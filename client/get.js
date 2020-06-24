import {doesTickMatch} from './question'

export const getBufferIndex = (tick, entitiesBuffer) => {
  const {length} = entitiesBuffer
  const index = entitiesBuffer.findIndex(doesTickMatch, {tick})
  return index === -1 || length > 4 ? length - 2 : index
}

export const getPredictionIndex = state => {
  const {predictionBuffer, entitiesByType, player} = state
  const {characters} = entitiesByType
  const {characterId} = player
  const character = characters[characterId]
  const {tick: tick_} = character
  const index = predictionBuffer.findIndex(({tick}) => tick === tick_)
  return {index, state}
}
