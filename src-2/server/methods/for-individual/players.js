module.exports = function methodsForIndividualPlayers() {

  return {

    input: function(input) {
      const player = this
      const inputs = Object.entries(input)
      inputs.forEach(input => {
        const inputType = input[0]
        input = input[1]
        player[inputType] = input
      })
    }

  }
}
