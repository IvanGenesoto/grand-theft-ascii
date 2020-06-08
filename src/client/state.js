const camera = {
  roomId: null,
  x: 0,
  y: 0,
  tag: 'canvas',
  elementId: 'camera',
  maxWidth: 1280,
  maxHeight: 720,
  style: {}
}

export const state = {
  camera,
  performance,
  fps: 30,
  tick: 0,
  imagesTotal: 0,
  imagesLoaded: 0,
  player: {},
  delayKit: {},
  entitiesBuffer: [],
  predictionBuffer: [],
  $city: document.getElementById('city')
}
