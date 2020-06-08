import {createPlayer, createCharacter, createVehicle} from '.'

export const createMayor = state => {
  const player = createPlayer(state)
  const character = createCharacter(state)
  const vehicle = createVehicle(state)
  const {id: playerId} = player
  const {id: characterId} = character
  player.characterId = characterId
  character.playerId = playerId
  character.elementId = null
  vehicle.elementId = null
  return state
}
