module.exports = function Entities(_entities, entity) {

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
      else if (value === 'length') log[0] = array.length
      else if (value === 'clear') {
        if (array.length) {
          array.length = 0
          log[0] = 'cleared'
        }
        else log[0] = 'nothing to clear'
      }
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
      log[0] = 'added'
    }
    else {
      log[0] = 'duplicate'
      console.log('Could not add ' + value + ' to array ' + index + '. Duplicate found.')
    }
  }

  function remove(value, array, index) {
    const match = array.findIndex(item => (item === value))
    if (match) {
      array.splice(match, 1)
      log[0] = 'removed'
    }
    else {
      log[0] = 'not found'
      console.log('Could not remove ' + value + ' from array ' + index + '. Item not found.')
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

  const $ = require

  const entities = Object.create(null, {

    length: {value: _entities.status.length},

    create: {value: function() {
      const createEntity = $('./create/entity')(_entities)
      const args = [createEntity, accessorPrototype, entities]
      const accessor = $('./create/accessor')(...args)
      return accessor.index
    }},

    standinArray: {value: []}
  })

  const log = ['']
  Object.defineProperty(entities, 'log', {get: () => log[0]})
  const accessorPrototype = $('./create/accessor-prototype')(_entities, entities, entity)
  const attributeNames = Object.keys(_entities)
  attributeNames.forEach(function (attributeName) {
    entities[attributeName] = createSetter(attributeName)
  })

  return entities
}
