import {getBufferIndex, getPredictionIndex} from '../get'
import {pipe, comparePrediction, reconcilePlayerCharacter, refresh} from '.'

export const shiftEntitiesBuffer = (state, isInitial) => {

  const {shiftingTimeoutId, entitiesBuffer, fps, ratioIndex, serverTick} = state
  const {length} = entitiesBuffer
  const shiftEntitiesBufferWithThese = shiftEntitiesBuffer.bind(null, state, isInitial)
  const delay = 1000 / fps

  clearTimeout(shiftingTimeoutId)

  if (length <= 2 || ratioIndex % 3) return isInitial && (state.shiftingTimeoutId = setTimeout(
    shiftEntitiesBufferWithThese, delay
  ))

  const index = getBufferIndex(serverTick, entitiesBuffer)
  const entitiesBuffer_ = state.entitiesBuffer = entitiesBuffer.slice(index)
  const [oldEntitiesByType, entitiesByType] = entitiesBuffer_
  const {characters} = entitiesByType
  const [mayor] = characters
  const {tick} = mayor

  state.oldEntitiesByType = oldEntitiesByType
  state.entitiesByType = entitiesByType
  state.serverTick = tick
  pipe(state, getPredictionIndex, comparePrediction, reconcilePlayerCharacter)
  state.ratioIndex = 0
  isInitial && refresh(state)
}
