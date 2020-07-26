export const saveState = (state, redis) => {

  const state_ = {
    ...state,
    io: null,
    now: null,
    delayKit: null,
    vehicleKits: null,
    connectionQueue: null,
    noTokenQueue: null,
    tokenQueue: null,
    latencyQueue: null,
    inputQueue: null
  }

  redis.set('state', JSON.stringify(state_)).catch(console.error)
}
