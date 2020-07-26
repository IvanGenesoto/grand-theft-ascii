import {createInstance, playerPrototype} from '..'

export const createPlayer = (state, socketId) => {

  const {_players} = state
  const player = createInstance(playerPrototype)

  player.socketId = socketId
  player.id = _players.length
  _players.push(player)

  return player
}
