module.exports = function createPlayerMethods(district) {

  const {players, characters, vehicles, rooms, $} = district // eslint-disable-line no-unused-vars

  let cashedInput = {}

  return {

    get input() {
      const player = this
      Object.keys(cashedInput)
        .forEach(inputType => {
          cashedInput[inputType] = player[inputType]
        })
      return cashedInput
    },

    set input(input) {
      const player = this
      cashedInput = input
      Object.entries(input)
        .forEach(inputEntry => {
          const inputKey = inputEntry[0]
          const input = inputEntry[1]
          player[inputKey] = input
        })
    }
  }
}
