const inputKit = {

  previousInput: {},
  callers: [],
  callerIndex: 0,

  getNextCallerIndex: () => inputKit.callerIndex > 100 ? 0 : inputKit.callerIndex++,

  fillCallers() {
    let callerCount = 100
    while (callerCount) {
      this.callers.push({
        player: {},
        get() { return inputKit.inputHandler.get.call(this.player) },
        set(value) { return inputKit.inputHandler.set.call(this.player, value) }
      })
      callerCount--
    }
  },

  inputHandler: Object.freeze({
    get() {
      const previousInput = inputKit.previousInput
      const keys = Object.keys(previousInput)
      for (let i = 0, key; (key = keys[i]); i++) {
        previousInput[key] = this[key].get()
      }
      return previousInput
    },
    set(input) {
      const entries = Object.entries(input)
      for (let i = 0, length = entries.length; i < length; i++) {
        const [key, value] = entries[i]
        this[key].set(value)
      }
      return (inputKit.previousInput = input)
    }
  })
}

module.exports = inputKit
