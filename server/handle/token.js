import {initiatePlayer} from '..'

export const handleToken = function ({token, socket, wrappedPlayer}) {

  const {state} = this
  const {players, city} = state
  const player = players.find(({token: token_}) => token_ === token)

  if (!player) return initiatePlayer.call(this, {socket, wrappedPlayer})

  wrappedPlayer.player = player
  socket.emit('player', player)
  socket.emit('city', city)

  return player
}
