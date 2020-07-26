import {createInstance, playerPrototype, generateToken} from '..'

export const createPlayer = (state, socketId) => {

  const {players} = state
  const player = createInstance(playerPrototype)

  player.socketId = socketId
  player.id = players.length
  player.token = generateToken()
  players.push(player)

  return player
}
