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
  elementID: [''],
  src: ['images/characters/man.png']
}) {

  function createCharacter(name) {
    const index = _characters.name.length
    const attributes = Object.values(_characters)
    attributes.forEach(attribute => {
      const defaultValue = attribute[0]
      if (Array.isArray(defaultValue)) attribute[index] = []
      else if (typeof defaultValue !== 'object') attribute[index] = defaultValue
      else throw console.log('Object or null found in default character')
    })
    return index
  }

  function createAccessor(index) {
    characters[index] = Object.create(accessorPrototype, {index: {value: index}})
    Object.freeze(characters[index])
    return index
  }

  function createAccessorPrototype(_characters) {
    let accessorPrototype = Object.create(null)
    accessorPrototype.standinArray = []
    const standinArray = accessorPrototype.standinArray
    const attributeNames = Object.keys(_characters)
    attributeNames.forEach(attributeName => {
      const attribute = _characters[attributeName]
      const defaultValue = attribute[0]
      if (Array.isArray(defaultValue)) {
        const propertyDescriptor = createArrayPropertyDescriptor(attributeName, standinArray)
        Object.defineProperty(accessorPrototype, attributeName, propertyDescriptor)
      }
      else if (typeof defaultValue !== 'object') {
        const propertyDescriptor = createDefaultPropertyDescriptor(attributeName)
        Object.defineProperty(accessorPrototype, attributeName, propertyDescriptor)
      }
      else throw console.log('Object or null found in default character')
    })
    return accessorPrototype
  }

  function createDefaultPropertyDescriptor(attributeName) {
    const attribute = _characters[attributeName]
    return {
      get: function() {
        return attribute[this.index]
      },
      set: function(value) {
        characters[attributeName](this.index, value)
      }
    }
  }

  function createArrayPropertyDescriptor(attributeName, standinArray) {
    return {
      get: function() {
        standinArray.length = 0
        const array = _characters[attributeName][this.index]
        array.forEach((value, index) => {
          standinArray[index] = value
        })
        return standinArray
      },
      set: function(value) {
        return characters[attributeName](this.index, value)
      }
    }
  }

  function createSetters(characters) {
    const attributeNames = Object.keys(_characters)
    attributeNames.forEach(attributeName => {
      const attribute = _characters[attributeName]
      const defaultValue = attribute[0]
      if (Array.isArray(defaultValue)) createArraySetter(attributeName)
      else if (Number.isInteger(defaultValue)) createIntegerSetter(attributeName)
      else if (typeof defaultValue !== 'object') createDefaultSetter(attributeName)
      else throw console.log('Object or null found in default character')
    })
  }

  function createDefaultSetter(attributeName) {
    const attribute = _characters[attributeName]
    const typeofDefaultValue = typeof attribute[0]
    characters[attributeName] = function(index, value) {
      const typofValue = typeof value
      if (typofValue === typeofDefaultValue) attribute[index] = value
      else throw console.log('characters[' + index + '].' + attributeName + ' must be a ' + typeofDefaultValue)
    }
  }

  function createIntegerSetter(attributeName) {
    const attribute = _characters[attributeName]
    characters[attributeName] = function(index, value) {
      if (Number.isInteger(value)) attribute[index] = value
      else throw console.log('characters[' + index + '].' + attributeName + ' must be an integer')
    }
  }

  function createArraySetter(attributeName) {
    const attribute = _characters[attributeName]
    let defaultValue = attribute[0]
    defaultValue = defaultValue[0]
    if (Number.isInteger(defaultValue)) createArrayIntegerSetter(attributeName)
    else throw console.log('Non-integer found in default _characters.' + attributeName)
  }

  function createArrayIntegerSetter(attributeName) {
    const attribute = _characters[attributeName]
    characters[attributeName] = function(index, value) {
      const array = attribute[index]
      if (Number.isInteger(value)) {
        if (value > 0) return push(value, array)
        else if (value < 0) return remove(value, array)
        else throw console.log('characters[' + index + '].' + attributeName + ' cannot be 0')
      }
      else throw console.log('characters[' + index + '].' + attributeName + ' must be an integer')
    }
  }

  function push(value, array) {
    const duplicate = array.find(item => item === value)
    if (!duplicate) array.push(value)
    else return 'duplicate'
  }

  function remove(value, array) {
    const match = array.find((item, index) => {
      if (item === value) return index
    })
    if (match) array[match] = 0
    else {
      console.log('Could not remove ' + value + ' from characters index attribute. Item not found.')
      return 'no match'
    }
  }

  const characters = {

    create: name => createAccessor(createCharacter(name))

  }

  const accessorPrototype = createAccessorPrototype(_characters)
  createSetters(characters)

  return Object.freeze(Object.create(characters))
}

module.exports = Characters
