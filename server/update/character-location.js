export const updateCharacterLocation = function (character) {
  const {state} = this
  const {drivingId, passengingId} = character
  if (drivingId || passengingId) updateTravelingCharacterLocation(character, state)
  else updateWalkingCharacterLocation(character, state)
  return character
}

export const updateTravelingCharacterLocation = (character, state) => {
  const {_vehicles} = state
  const {drivingId, passengingId} = character
  const vehicle = drivingId ? _vehicles[drivingId] : _vehicles[passengingId]
  const {x, y, width, height, direction} = vehicle
  const leftDirections = ['left', 'up-left', 'down-left']
  const rightDirections = ['right', 'up-right', 'down-right']
  character.x = x + width / 2 - character.width / 2
  character.y = y + height / 2 - character.height / 2 - 5
  leftDirections.includes(direction) && (character.direction = 'left')
  rightDirections.includes(direction) && (character.direction = 'right')
  return character
}

export const updateWalkingCharacterLocation = (character, state) => {
  const {city} = state
  const {speed, direction, width, playerId, x} = character
  const maxX = city.width - width
  const maxY = 7832
  character.y < 0 && (character.y = 0)
  character.y < maxY && (character.y += 20)
  character.y > maxY && (character.y = maxY)
  if (speed <= 0) return state
  character.x = direction === 'left' ? x - speed : x + speed
  if (playerId) {
    character.x < 0 && (character.x = 0)
    character.x > maxX && (character.x = maxX)
    return state
  }
  character.x < 0 && (character.direction = 'right')
  character.x > maxX && (character.direction = 'left')
  return character
}
