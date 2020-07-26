export const generateToken = () => {

  const charactersString =
      '0123456789'
    + 'abcdefghijklmnopqrstuvwxyz'
    + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  const {length} = charactersString

  let count = 16
  let token = ''

  while (count) {
    const random = Math.random()
    const float = length * random
    const index = Math.floor(float)
    const character = charactersString.charAt(index)
    token += character
    --count
  }

  return token
}
