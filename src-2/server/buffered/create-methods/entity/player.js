module.exports = function createPlayerMethods(district) {

  let reusedInputObject = {}

  const playerMethods = {

    get input() {
      const player = this
      Object.keys(reusedInputObject)
        .forEach(inputType => {
          reusedInputObject[inputType] = player[inputType]
        })
      return reusedInputObject
    },

    set input(input) {
      const player = this
      reusedInputObject = input
      Object.entries(input)
        .forEach(inputEntry => {
          const inputKey = inputEntry[0]
          const input = inputEntry[1]
          player[inputKey] = input
        })
    }
  }

  return playerMethods
}
