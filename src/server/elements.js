const _districts = {
  status: [''],
  established: [0],
  rooms: [[0]],
  characters: [[0]],
  vehicles: [[0]],
  unwelcomes: [[0]],
  scenery: [
    [ // stratum 0
      [ // layer 0
        [ // row 0
          'images/background/far/above-top.png' // column 0 scenery
        ]
      ]
    ]
  ],
  collision: [
    [ // stratum 0
      [ // layer 0
        [ // row 0
          [0] // column 0 collision
        ]
      ]
    ]
  ]
}

const _players = {
  status: ['on'],
  socket: [''],
  character: [0],
  predictionBuffer: [undefined],
  latencyBuffer: [[0.1]],
  up: [false],
  down: [false],
  left: [false],
  right: [false],
  accelerate: [false],
  decelerate: [false],
  enter: [false],
  exit: [false]
}

const _characters = {
  name: [''],
  status: [''],
  player: [0],
  latency: [0.1], // test 0.0
  district: [0],
  zone: [0],
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
}

const _vehicles = {
  status: 'operational',
  model: 'delorean',
  district: [0],
  zone: [0],
  seats: [2],
  driver: [0],
  masterKeyHolders: [[0]],
  keyHolders: [[0]],
  welcomes: [[0]],
  passengers: [[0]],
  x: [0.1],
  y: [0.1],
  width: [268],
  height: [80],
  direction: ['right'],
  previousDirection: ['right'],
  speed: [0],
  maxSpeed: [80],
  slowing: [false],
  falling: [false],
  acceleration: [4],
  deceleration: [10],
  armor: [0],
  weight: [0],
  element: ['img'],
  elementID: [''],
  src: ['images/vehicles/delorean.png']
}

const _rooms = {
  status: ['locked'],
  name: ['Pad'],
  district: [0],
  zone: [0],
  capacity: [50],
  occupants: [[0]],
  masterKeyHolders: [[0]],
  keyHolders: [[0]],
  unwelcomes: [[0]],
  x: [0.1],
  y: [0.1],
  width: [0],
  height: [0],
  element: ['canvas'],
  background: [0],
  foreground: [0],
  inventory: [[0]]
}

const standinArray = []

function Elements(_elements) {

  if (typeof _elements === 'string') {
    switch (_elements) {
      case '_zones': _elements = _districts; break
      case '_players': _elements = _players; break
      case '_characters': _elements = _characters; break
      case '_vehicles': _elements = _vehicles; break
      case '_rooms': _elements = _rooms; break
      default: throw console.log('Element type not found')
    }
  }

  function createElement(name) {
    const index = _elements.status.length
    const attributes = Object.values(_elements)
    attributes.forEach(attribute => {
      const defaultValue = attribute[0]
      if (Array.isArray(defaultValue)) attribute[index] = []
      else if (typeof defaultValue !== 'object') attribute[index] = defaultValue
      else throw console.log('Object or null found in default element')
    })
    return index
  }

  function createAccessor(index) {
    elements[index] = Object.create(accessorPrototype, {index: {value: index}})
    Object.freeze(elements[index])
    return index
  }

  function createAccessorPrototype(_elements) {
    let accessorPrototype = Object.create(null)
    accessorPrototype.standinArray = []
    const standinArray = accessorPrototype.standinArray
    const attributeNames = Object.keys(_elements)
    attributeNames.forEach(attributeName => {
      accessorPrototype = defineProperty(accessorPrototype, standinArray, attributeName)
    })
    return accessorPrototype
  }

  function defineProperty(accessorPrototype, standinArray, attributeName) {
    const attribute = _elements[attributeName]
    const defaultValue = attribute[0]
    if (Array.isArray(defaultValue)) {
      return defineArrayProperty(accessorPrototype, standinArray, attributeName)
    }
    else if (typeof defaultValue !== 'object') {
      return defineDefaultProperty(accessorPrototype, attributeName)
    }
    else throw console.log('Object or null found in default element')
  }

  function defineDefaultProperty(accessorPrototype, attributeName) {
    const propertyDescriptor = createDefaultPropertyDescriptor(attributeName)
    return Object.defineProperty(accessorPrototype, attributeName, propertyDescriptor)
  }

  function defineArrayProperty(accessorPrototype, standinArray, attributeName) {
    const attribute = _elements[attributeName]
    const defaultValue = attribute[0]
    if (!Array.isArray(defaultValue[0])) {
      var propertyDescriptor = createNestedArrayPropertyDescriptor(attributeName)
    }
    else propertyDescriptor = createArrayPropertyDescriptor(attributeName, standinArray)
    return Object.defineProperty(accessorPrototype, attributeName, propertyDescriptor)
  }

  function createDefaultPropertyDescriptor(attributeName) {
    const attribute = _elements[attributeName]
    return {
      get: function() {
        return attribute[this.index]
      },
      set: function(value) {
        elements[attributeName](this.index, value)
      }
    }
  }

  function createArrayPropertyDescriptor(attributeName, standinArray) {
    return {
      get: function() {
        standinArray.length = 0
        const array = _elements[attributeName][this.index]
        array.forEach((value, index) => {
          standinArray[index] = value
        })
        return standinArray
      },
      set: function(value) {
        return elements[attributeName](this.index, value)
      }
    }
  }

  function createNestedArrayPropertyDescriptor(attributeName) {
    const attribute = _elements[attributeName]
    const defaultValue = attribute[[[[0]]]]
    if (Number.isInteger(defaultValue)) {
      return createNestedIntegerPropertyDescriptor(attributeName)
    }
    else if (typeof defaultValue === 'string') {
      return createNestedStringPropertyDescriptor(attributeName)
    }
    else throw console.log('Cannot create nested property descriptor of non-integer or -string')
  }

  function createNestedIntegerPropertyDescriptor(attributeName) {
    return {
      get: () => console.log('Use setter'),
      set: function(value) {
        return elements[attributeName](value)
      }
    }
  }

  function createNestedStringPropertyDescriptor(attributeName) {
    return {
      get: function() {
        return console.log('Scenery getter not implemented')
      },
      set: function(value) {
        return console.log('Scenery setter not implemented')
      }
    }
  }

  function createSetters(elements) {
    const attributeNames = Object.keys(_elements)
    attributeNames.forEach(attributeName => {
      const attribute = _elements[attributeName]
      const defaultValue = attribute[0]
      if (Array.isArray(defaultValue)) createArraySetter(attributeName, defaultValue)
      else if (Number.isInteger(defaultValue)) createIntegerSetter(attributeName)
      else if (typeof defaultValue !== 'object') createDefaultSetter(attributeName)
      else throw console.log('Object or null found in default element')
    })
  }

  function createDefaultSetter(attributeName) {
    const attribute = _elements[attributeName]
    const typeofDefaultValue = typeof attribute[0]
    elements[attributeName] = function(index, value) {
      const typofValue = typeof value
      if (typofValue === typeofDefaultValue) attribute[index] = value
      else throw console.log('elements[' + index + '].' + attributeName + ' must be a ' + typeofDefaultValue)
    }
  }

  function createIntegerSetter(attributeName) {
    const attribute = _elements[attributeName]
    elements[attributeName] = function(index, value) {
      if (Number.isInteger(value)) attribute[index] = value
      else throw console.log('elements[' + index + '].' + attributeName + ' must be an integer')
    }
  }

  function createArraySetter(attributeName, defaultValue) {
    const typeofDefaultValue = typeof defaultValue
    if (Array.isArray(typeofDefaultValue)) createNestedArraySetter(attributeName)
    else if (Number.isInteger(defaultValue)) createIntegerArraySetter(attributeName)
    else if (typeofDefaultValue !== 'object') createDefaultArraySetter(attributeName, typeofDefaultValue)
    else throw console.log('Non-integer found in default _elements.' + attributeName)
  }

  function createDefaultArraySetter(attributeName, typeofDefaultValue) {
    const attribute = _elements[attributeName]
    elements[attributeName] = function(index, value) {
      const array = attribute[index]
      const typofValue = typeof value
      if (typofValue === typeofDefaultValue) {
        if (value > 0) return push(value, array)
        else if (value < 0) return array.shift()
        else throw console.log('Cannot push 0 to ' + attributeName)
      }
      else if (value === 'length') return array.length
      else if (value === 'clear') array.length = 0
      else throw console.log('elements[' + index + '].' + attributeName + ' must be a ' + typeofDefaultValue)
    }
  }

  function createIntegerArraySetter(attributeName) {
    const attribute = _elements[attributeName]
    elements[attributeName] = function(index, value) {
      const array = attribute[index]
      if (Number.isInteger(value)) {
        if (value > 0) return push(value, array)
        else if (value < 0) return remove(value, array)
        else throw console.log('Cannot push 0 to ' + attributeName)
      }
      else if (value === 'length') return array.length
      else if (value === 'clear') array.length = 0
      else throw console.log('elements[' + index + '].' + attributeName + ' must be an integer')
    }
  }

  function createNestedArraySetter(attributeName) {
    const attribute = _elements[attributeName]
    elements[attributeName] = function(joinedValue) {
      if (joinedValue === 'clear') return clear(attributeName)
      const [stratum, layer, row, collumn, value] = joinedValue.split('.')
      const array = attribute[stratum][layer][row][collumn]
      if (value) return set(array)
      else return get(array)
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
      console.log('Could not remove ' + value + ' from elements index attribute. Item not found.')
      return 'no match'
    }
  }

  function get(array) {
    standinArray.length = 0
    array.forEach((value, index) => {
      standinArray[index] = value
    })
    return standinArray
  }

  function set(value, array) {
    if (Number.isInteger(value)) {
      if (value > 0) return push(value, array)
      else if (value < 0) return remove(value, array)
      else throw console.log('Cannot push 0')
    }
    else if (value === 'length') return array.length
    else if (value === 'clear') array.length = 0
    else throw console.log('element must be an integer')
  }

  function clear(attributeName) {
    const array = _elements[attributeName]
    loopThrough(array)
    function loopThrough(array) {
      array.forEach(array => {
        if (Array.isArray(array[0])) loopThrough(array)
        else array.length = 0
      })
    }
  }

  const elements = {

    length: _elements.length,

    create: name => createAccessor(createElement(name))

  }

  const accessorPrototype = createAccessorPrototype(_elements)
  createSetters(elements)

  return Object.freeze(Object.create(elements))
}

module.exports = Elements
