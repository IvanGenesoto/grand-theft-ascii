export const updateLatencies = (characters, latencyKit) => {

  if (!latencyKit) return

  const {characterId, latency} = latencyKit
  const character = characters[characterId]

  character.latency = latency

  return characters
}
