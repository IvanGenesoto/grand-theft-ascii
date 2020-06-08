const input = {
  up: false,
  down: false,
  left: false,
  right: false,
  action: false
}

export const playerPrototype = {
  id: null,
  status: 'online',
  socketId: null,
  characterId: null,
  previousAction: false,
  latencyBuffer: [],
  input
}
