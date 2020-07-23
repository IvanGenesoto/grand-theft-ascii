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

export const getFrameIndex = (frameOffset, tick) => {
  const remainder = tick % 24
  const index =
      remainder < 3 ? 0
    : remainder < 6 ? 1
    : remainder < 9 ? 2
    : remainder < 12 ? 3
    : remainder < 15 ? 4
    : remainder < 18 ? 5
    : remainder < 21 ? 6
    : 7
  return (index + frameOffset) % 8
}
