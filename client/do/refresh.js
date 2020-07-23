import {shiftEntitiesBuffer, setInterpolationRatio, deferRefresh} from '.'
import {render} from '../render'

import {
  updatePlayerCharacterBehavior,
  updatePlayerCharacterLocation,
  updatePredictionBuffer,
  updateCamera
} from '../update'

export const refresh = state => {

  const {performance, player, entitiesByType, socket} = state
  const {characters} = entitiesByType
  const {characterId} = player
  const character = characters[characterId]
  const {drivingId} = character
  const tick = ++state.tick
  const input = {...player.input, tick}

  state.refreshingStartTime = performance.now()
  socket.emit('input', input)
  shiftEntitiesBuffer(state)
  setInterpolationRatio(state)
  drivingId || updatePlayerCharacterBehavior(input, state)
  drivingId || updatePlayerCharacterLocation(state)
  drivingId || updatePredictionBuffer(input, state)
  updateCamera(state)
  render(state)
  deferRefresh(state)
}
