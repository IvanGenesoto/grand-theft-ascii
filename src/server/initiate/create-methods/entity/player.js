module.exports = function createPlayerMethods(district, initiate) {

  const {players, characters, vehicles, rooms} = district // eslint-disable-line no-unused-vars

  return {

    get input() {
      const inputKit = initiate.inputKit
      inputKit.fillCallers()
      const caller = inputKit.callers[inputKit.getNextCallerIndex()]
      caller.player = this
      return caller
    }
  }
}
