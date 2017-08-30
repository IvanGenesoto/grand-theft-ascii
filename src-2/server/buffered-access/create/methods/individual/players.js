module.exports = function createIndividualPlayerMethods(district) {

  let reusedInputObject = {}

  return {

    getInput() {
      const player = this
      Object.keys(reusedInputObject)
        .forEach(inputType => {
          reusedInputObject[inputType] = player[inputType]
        })
      return reusedInputObject
    },

    setInput(input) {
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
}
