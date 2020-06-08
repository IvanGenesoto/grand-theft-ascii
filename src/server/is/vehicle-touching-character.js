export const isVehicleTouchingCharacter = (vehicle, character) =>
     character.x < vehicle.x + vehicle.width
  && character.x + character.width > vehicle.x
  && character.y < vehicle.y + vehicle.height
  && character.y + character.height > vehicle.y
