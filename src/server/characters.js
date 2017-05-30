function Characters(_characters = {
  name: [''],
  status: [''],
  player: [0],
  latency: [0.1], // test 0.0
  district: [0],
  driving: [0],
  passenging: [0],
  occupying: [0],
  entering: [0],
  exiting: [0],
  vehicleMasterKeys: [[0]],
  vehicleKeys: [[0]],
  vehicleWelcomes: [[0]],
  roomMasterKeys: [[0]],
  roomKeys: [[0]],
  roomUnwelcomes: [[0]],
  x: [0.1],
  y: [0.1],
  z: [0.1],
  width: [0],
  height: [0],
  direction: ['right'],
  speed: [0.1],
  maxSpeed: [0],
  element: ['img'],
  elementID: ['c0'],
  src: ['images/characters/man.png']
}) {

  function createCharacter(name) {
    const index = _characters.name.length
    const attributes = Object.values(_characters)
    attributes.forEach(attribute => {
      const defaultValue = attribute[0]
      if (Array.isArray(defaultValue)) attribute[index] = []
      else if (typeof defaultValue !== 'object') attribute[index] = defaultValue
      else throw console.log('No objects or null in default character')
    })
    return index
  }

  function createAccessor(index) {

  }

  function createSetterPrototype() {

  }

  function createSetters() {

  }

  const characters = {

    create: name => createAccessor(createCharacter(name))

  }

  const setterPrototype = createSetterPrototype()
  createSetters(setterPrototype)

  return Object.freeze(characters)
}

module.exports = Characters
