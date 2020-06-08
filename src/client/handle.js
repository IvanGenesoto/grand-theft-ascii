import {createElement} from './create'

export const handlePlayer = function (player) {
  const {state} = this
  state.player = player
}

export const handleEntities = function (entitiesByType) {
  const {state} = this
  const {socket, entitiesBuffer, entitiesByType: entitiesByType_} = state
  const {characters, vehicles} = entitiesByType
  const [mayor] = characters
  const {timestamp} = mayor
  socket.emit('timestamp', timestamp)
  entitiesBuffer.push(entitiesByType)
  if (entitiesByType_) return
  state.entitiesByType = entitiesByType
  characters.forEach(createElement.bind({state}))
  vehicles.forEach(createElement.bind({state}))
}
