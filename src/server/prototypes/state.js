import now from 'performance-now'

export const state = {
  tick: 0,
  elementCount: 0,
  layerY: 0,
  fps: 30,
  characterCount: 50,
  vehicleCount: 50,
  connectionQueue: [],
  latencyQueue: [],
  inputQueue: [],
  vehicleKits: [],
  delayKit: {},
  _players: [],
  _characters: [],
  _vehicles: [],
  now
}
