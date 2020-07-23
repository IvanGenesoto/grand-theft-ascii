export const updateLatencies = (_characters, latencyKit) => {

  if (!latencyKit) return

  const {characterId, latency} = latencyKit
  const character = _characters[characterId]

  character.latency = latency

  return _characters
}
