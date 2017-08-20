const propertyDescriptor = {
  configurable: true,
  enumerable: true,
  writable: true
}

const _ = propertyDescriptor

const _characters = Object.create(null, {
  entityType: {value: ['characters'], ..._},
  indexInDistrict: {value: [0], ..._},
  status: {value: [''], ..._},
  name: {value: [''], ..._},
  player: {value: [0], ..._},
  latency: {value: [0.1], ..._}, // test 0.0
  district: {value: [0], ..._},
  stratum: {value: [0], ..._},
  driving: {value: [0], ..._},
  passenging: {value: [0], ..._},
  occupying: {value: [0], ..._},
  entering: {value: [0], ..._},
  exiting: {value: [0], ..._},
  vehicleMasterKeys: {value: [[0]], ..._},
  vehicleKeys: {value: [[0]], ..._},
  vehicleWelcomes: {value: [[0]], ..._},
  roomMasterKeys: {value: [[0]], ..._},
  roomKeys: {value: [[0]], ..._},
  roomUnwelcomes: {value: [[0]], ..._},
  x: {value: [0.1], ..._},
  y: {value: [0.1], ..._},
  z: {value: [0.1], ..._},
  width: {value: [0], ..._},
  height: {value: [0], ..._},
  direction: {value: ['right'], ..._},
  speed: {value: [0.1], ..._},
  maxSpeed: {value: [0], ..._},
  element: {value: ['img'], ..._},
  elementID: {value: [''], ..._},
  src: {value: ['images/characters/man.png'], ..._}
})

module.exports = _characters
