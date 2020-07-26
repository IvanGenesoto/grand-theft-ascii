import {createInstance, characterPrototype} from '..'

export const createCharacter = state => {

  const {_characters, city} = state
  const directions = ['left', 'right']
  const character = createInstance(characterPrototype)
  const id = character.id = _characters.length

  character.elementId = 'character-' + id
  _characters.push(character)

  const float = Math.random() * directions.length
  const index = Math.floor(float)

  character.direction = directions[index]
  character.x = Math.random() * (city.width - character.width)
  character.y = city.height - 168
  character.speed = Math.random() * (character.maxSpeed - 3) + 3
  character.frameOffset = Math.floor(Math.random() * 7)

  return character
}
