module.exports = function createEntitySpecificPlayerMethods(district) {

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
        .forEach(inputProperty => player[inputProperty[0]] = inputProperty[1]) // eslint-disable-line no-return-assign
    }

  }
}
