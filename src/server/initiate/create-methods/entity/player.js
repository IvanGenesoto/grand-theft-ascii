module.exports = function createPlayerMethods(district) {

  const {players, characters, vehicles, rooms, $} = district // eslint-disable-line no-unused-vars

  return {

    get input() {
      const inputKit = $('./input-kit')
      inputKit.fillCallers()
      const caller = inputKit.callers[inputKit.getNextCallerIndex()]
      caller.player = this
      return caller
    }
  }
}
