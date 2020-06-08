import {createPlayer, createCharacter, createVehicle} from '../create'

export const initiatePlayer = function ({socket, wrappedPlayer}) {
  const {state} = this
  const {city, io} = state
  const {id: socketId} = socket
  const player = wrappedPlayer.player = createPlayer(state, socketId)
  const {id: playerId} = player
  const character = createCharacter(state)
  const {id: characterId} = character
  player.characterId = characterId
  character.playerId = playerId
  const {x: characterX} = character
  const vehicleX = getVehicleX(characterX)
  const vehicle = createVehicle(state, vehicleX, 7843, 0)
  socket.emit('player', player)
  socket.emit('city', city)
  io.emit('entity', character)
  io.emit('entity', vehicle)
  return state
}

const getVehicleX = characterX => {
  const distance = Math.random() * (1000 - 200) + 200
  const sides = ['left', 'right']
  const random = Math.random()
  const index = Math.floor(random * sides.length)
  const side = sides[index]
  return side === 'left' ? characterX - distance : characterX + distance
}
