module.exports = function Entities(_entities) {

  function createEntity() {
    const index = _entities.status.length
    const attributes = Object.values(_entities)
    attributes.forEach(attribute => {
      const defaultValue = attribute[0]
      if (Array.isArray(defaultValue)) attribute[index] = createArrayAttribute(defaultValue)
      else if (typeof defaultValue !== 'object') attribute[index] = defaultValue
      else throw console.log('Object or null found in default entity')
    })
    return index
  }

  function createArrayAttribute(defaultArray) {
    if (Array.isArray(defaultArray[0])) return defaultArray
    else return []
  }

  function createAccessor(index, accessorPrototype) {
    entities[index] = Object.create(accessorPrototype, {index: {value: index}})
    return Object.freeze(entities[index])
  }

  function createAccessorPrototype(_entities) {
    let accessorPrototype = Object.create(null)
    accessorPrototype.standinArray = []
    const standinArray = accessorPrototype.standinArray
    const attributeNames = Object.keys(_entities)
    attributeNames.forEach(attributeName => {
      accessorPrototype = defineProperty(accessorPrototype, standinArray, attributeName)
    })
    return accessorPrototype
  }

  function defineProperty(accessorPrototype, standinArray, attributeName) {
    const attribute = _entities[attributeName]
    const defaultValue = attribute[0]
    if (Array.isArray(defaultValue)) {
      return defineArrayProperty(accessorPrototype, standinArray, attributeName)
    }
    else if (typeof defaultValue !== 'object') {
      return defineDefaultProperty(accessorPrototype, attributeName)
    }
    else throw console.log('Object or null found in default entity')
  }

  function defineDefaultProperty(accessorPrototype, attributeName) {
    const descriptor = createDefaultDescriptor(attributeName)
    return Object.defineProperty(accessorPrototype, attributeName, descriptor)
  }

  function defineArrayProperty(accessorPrototype, standinArray, attributeName) {
    const attribute = _entities[attributeName]
    const defaultValue = attribute[0]
    if (Array.isArray(defaultValue[0])) {
      var descriptor = createNestedArrayDescriptor(attributeName, attribute)
    }
    else descriptor = createArrayDescriptor(attributeName, standinArray)
    return Object.defineProperty(accessorPrototype, attributeName, descriptor)
  }

  function createDefaultDescriptor(attributeName) {
    return {
      get: function() {
        return _entities[attributeName][this.index]
      },
      set: function(value) {
        entities[attributeName](this.index, value)
      }
    }
  }

  function createArrayDescriptor(attributeName, standinArray) {
    return {
      get: function() {
        standinArray.length = 0
        const array = _entities[attributeName][this.index]
        array.forEach((value, index) => {
          standinArray[index] = value
        })
        return standinArray
      },
      set: function(value) {
        return entities[attributeName](this.index, value)
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
      get: function() {
        return entities.standinArray
      },
      set: function(value) {
        return entities[attributeName](this.index, value)
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
    const attribute = _entities[attributeName]
    const defaultValue = attribute[0]
    if (Array.isArray(defaultValue)) return createArraySetter(attributeName, defaultValue)
    else if (Number.isInteger(defaultValue)) return createIntegerSetter(attributeName, attribute)
    else if (typeof defaultValue !== 'object') return createDefaultSetter(attributeName, attribute)
    else throw console.log('Object or null found in default entity')
  }

  function createDefaultSetter(attributeName, attribute) {
    const typeofDefaultValue = typeof attribute[0]
    return function (index, value) {
      const typofValue = typeof value
      if (typofValue === typeofDefaultValue) attribute[index] = value
      else throw console.log('entities[' + index + '].' + attributeName + ' must be a ' + typeofDefaultValue)
    }
  }

  function createIntegerSetter(attributeName, attribute) {
    return function (index, value) {
      if (Number.isInteger(value)) attribute[index] = value
      else throw console.log('entities[' + index + '].' + attributeName + ' must be an integer')
    }
  }

  function createArraySetter(attributeName, defaultArray) {
    const defaultValue = defaultArray[0]
    const typeofDefaultValue = typeof defaultValue
    if (Array.isArray(defaultValue)) return createNestedArraySetter(defaultArray)
    else if (Number.isInteger(defaultValue)) return createIntegerArraySetter(attributeName)
    else if (typeofDefaultValue !== 'object') return createDefaultArraySetter(attributeName, defaultArray, typeofDefaultValue)
    else throw console.log('Object or null found in default _entities.' + attributeName)
  }

  function createDefaultArraySetter(attributeName, defaultArray, typeofDefaultValue) {
    return function (index, value) {
      const array = defaultArray[index]
      const typofValue = typeof value
      if (typofValue === typeofDefaultValue) {
        if (value > 0) return push(value, array)
        else if (value < 0) return array.shift()
        else throw console.log('Cannot push 0 to ' + attributeName)
      }
      else if (value === 'length') return array.length
      else if (value === 'clear') array.length = 0
      else throw console.log('entities[' + index + '].' + attributeName + ' must be a ' + typeofDefaultValue)
    }
  }

  function createIntegerArraySetter(attributeName) {
    return function (index, value) {
      const array = _entities[attributeName][index]
      if (Number.isInteger(value)) {
        if (value > 0) push(value, array, index)
        else if (value < 0) remove(value, array, index)
        else throw console.log('Cannot push 0 to ' + attributeName)
      }
      else if (value === 'length') _entities.log[index] = array.length
      else if (value === 'clear') array.length = 0
      else throw console.log('entities[' + index + '].' + attributeName + ' must be an integer')
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

  function push(value, array, index) {
    const duplicate = array.find(item => item === value)
    if (!duplicate) {
      array.push(value)
      _entities.log[index] = 'added'
    }
    else {
      _entities.log[index] = 'duplicate'
      console.log('Could not add ' + value + ' to array. Duplicate found.')
    }
  }

  function remove(value, array, index) {
    const match = array.findIndex(item => (item === value))
    if (match) {
      array.splice(match, 1)
      _entities.log[index] = 'removed'
    }
    else {
      _entities.log[index] = 'not found'
      console.log('Could not remove ' + value + ' from array. Item not found.')
    }
  }

  function get(array, index, attributeName) {
    const standinArray = entities.standinArray
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
    else throw console.log('entity must be an integer')
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

  const entities = {

    length: _entities.status.length,

    create: function() {
      const accessor = createAccessor(createEntity(), accessorPrototype)
      return accessor.index
    },

    standinArray: []

  }

  const accessorPrototype = createAccessorPrototype(_entities)
  const attributeNames = Object.keys(_entities)
  attributeNames.forEach(function (attributeName) {
    entities[attributeName] = createSetter(attributeName)
  })

  return entities
}
