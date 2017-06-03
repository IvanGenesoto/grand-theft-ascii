const _districts = {
  status: [''],
  rooms: [[0]],
  characters: [[0]],
  vehicles: [[0]],
  unwelcomes: [[0]],
  scenery: [ // district
    [ // stratum
      [ // layer
        [ // row
          [ // column
            'images/background/far/above-top.png'
          ]
        ]
      ]
    ]
  ],
  collision: [ // district
    [ // stratum
      [ // layer
        [ // row
          [ // column
            [0]
          ]
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

function Elements(_elements) {

  if (typeof _elements === 'string') {
    switch (_elements) {
      case '_districts': _elements = _districts; break
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
      if (Array.isArray(defaultValue)) attribute[index] = createArrayAttribute(defaultValue)
      else if (typeof defaultValue !== 'object') attribute[index] = defaultValue
      else throw console.log('Object or null found in default element')
    })
    return index
  }

  function createArrayAttribute(defaultArray) {
    if (Array.isArray(defaultArray[0])) return defaultArray
    else return []
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
    const descriptor = createDefaultDescriptor(attributeName)
    return Object.defineProperty(accessorPrototype, attributeName, descriptor)
  }

  function defineArrayProperty(accessorPrototype, standinArray, attributeName) {
    const attribute = _elements[attributeName]
    const defaultValue = attribute[0]
    if (Array.isArray(defaultValue[0])) {
      var descriptor = createNestedArrayDescriptor(attributeName, attribute)
    }
    else descriptor = createArrayDescriptor(attributeName, standinArray)
    return Object.defineProperty(accessorPrototype, attributeName, descriptor)
  }

  function createDefaultDescriptor(attributeName) {
    return {
      get: () => _elements[attributeName][this.index],
      set: function(value) {
        elements[attributeName](this.index, value)
      }
    }
  }

  function createArrayDescriptor(attributeName, standinArray) {
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

  function createNestedArrayDescriptor(attributeName, attribute) {
    while (Array.isArray(attribute)) attribute = attribute[0]
    const defaultValue = attribute
    if (Number.isInteger(defaultValue)) {
      return createNestedArrayIntegerDescriptor(attributeName)
    }
    else if (typeof defaultValue === 'string') {
      return createNestedArrayStringDescriptor(attributeName)
    }
    else throw console.log('Cannot create nested property descriptor of non-integer or -string')
  }

  function createNestedArrayIntegerDescriptor(attributeName) {
    return {
      get: () => elements.standinArray,
      set: function(value) {
        return elements[attributeName](this.index, value)
      }
    }
  }

  function createNestedArrayStringDescriptor(attributeName) {
    return {
      get: () => console.log('Scenery getter not implemented'),
      set: value => console.log('Scenery setter not implemented')
    }
  }

  function createSetter(attributeName) {
    const attribute = _elements[attributeName]
    const defaultValue = attribute[0]
    if (Array.isArray(defaultValue)) return createArraySetter(attributeName, attribute)
    else if (Number.isInteger(defaultValue)) return createIntegerSetter(attributeName, attribute)
    else if (typeof defaultValue !== 'object') return createDefaultSetter(attributeName, attribute)
    else throw console.log('Object or null found in default element')
  }

  function createDefaultSetter(attributeName, attribute) {
    const typeofDefaultValue = typeof attribute[0]
    return function (index, value) {
      const typofValue = typeof value
      if (typofValue === typeofDefaultValue) attribute[index] = value
      else throw console.log('elements[' + index + '].' + attributeName + ' must be a ' + typeofDefaultValue)
    }
  }

  function createIntegerSetter(attributeName, attribute) {
    return function (index, value) {
      if (Number.isInteger(value)) attribute[index] = value
      else throw console.log('elements[' + index + '].' + attributeName + ' must be an integer')
    }
  }

  function createArraySetter(attributeName, attribute) {
    const defaultValue = attribute[0]
    const typeofDefaultValue = typeof defaultValue
    if (Array.isArray(defaultValue)) return createNestedArraySetter(attribute)
    else if (Number.isInteger(defaultValue)) return createIntegerArraySetter(attributeName, attribute)
    else if (typeofDefaultValue !== 'object') return createDefaultArraySetter(attributeName, attribute, typeofDefaultValue)
    else throw console.log('Object or null found in default _elements.' + attributeName)
  }

  function createDefaultArraySetter(attributeName, attribute, typeofDefaultValue) {
    return function (index, value) {
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

  function createIntegerArraySetter(attributeName, attribute) {
    return function (index, value) {
      const array = attribute[index]
      if (Number.isInteger(value)) {
        if (value > 0) return push(-value, array)
        else if (value < 0) return remove(value, array)
        else throw console.log('Cannot push 0 to ' + attributeName)
      }
      else if (value === 'length') return array.length
      else if (value === 'clear') array.length = 0
      else throw console.log('elements[' + index + '].' + attributeName + ' must be an integer')
    }
  }

  function createNestedArraySetter(attribute) {
    return function (index, joinedValue) {
      if (joinedValue === 'clear') return clear(attribute)
      const [stratum, layer, row, column, value] = joinedValue.split('.')
      const array = attribute[index][stratum][layer][row][column]
      if (value) return set(value, array)
      else return get(array)
    }
  }

  function push(value, array) {
    const duplicate = array.find(item => item === value)
    if (!duplicate) array.push(value)
    else return 'duplicate'
  }

  function remove(value, array) {
    const match = array.find(item => (item === value))
    if (match) {
      const index = array.indexOf(value)
      array[index] = 0
    }
    else {
      console.log('Could not remove ' + value + ' from elements index attribute. Item not found.')
      return 'no match'
    }
  }

  function get(array, index, attributeName) {
    const standinArray = elements.standinArray
    standinArray.length = 0
    array.forEach((value, index) => {
      standinArray[index] = value
    })
    return standinArray
  }

  function set(value, array) {
    if (Number.isInteger(+value)) {
      value = +value
      if (value > 0) return push(value, array)
      else if (value < 0) return remove(-value, array)
      else throw console.log('Cannot push 0')
    }
    else if (value === 'length') return array.length
    else if (value === 'clear') array.length = 0
    else throw console.log('element must be an integer')
  }

  function clear(array) {
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

    create: name => createAccessor(createElement(name), accessorPrototype),

    standinArray: []

  }

  const accessorPrototype = createAccessorPrototype(_elements)
  const attributeNames = Object.keys(_elements)
  attributeNames.forEach(function (attributeName) {
    elements[attributeName] = createSetter(attributeName)
  })

  return Object.freeze(Object.create(elements))
}

module.exports = Elements
