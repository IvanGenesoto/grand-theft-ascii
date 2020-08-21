import {initiateServer} from '..'

export const getState = async (redis, isProduction) => {

  const stateJson = await redis.get('state').catch(console.error)
  const _state = stateJson && JSON.parse(stateJson)

  isProduction || console.info(_state && `${_state.players.length - 1} players`)
  initiateServer(_state, redis, isProduction)
}
