module.exports = function createArrayMethod({
  _defaultValue, _attribute, attributeName, entityType, indexesByID, $, _
}) {

  const [defaultValue] = _defaultValue
  const typeofDefaultValue = Number.isInteger(defaultValue)
    ? 'integer'
    : typeof defaultValue

  $(_ + 'filter/typeof-default-value')(
    defaultValue, typeofDefaultValue, attributeName, entityType
  )

  const log = []
  const standIns = [[], []]
  let standinIndex = 0
  let thisID

  const arrayAttributeMethods = {

    get length() {
      const index = indexesByID[thisID]
      const values = _attribute[index]
      return values.length
    },

    get all() {
      const standIn = standIns[standinIndex]
      standIn.length = 0
      const index = indexesByID[thisID]
      const values = _attribute[index]
      values.forEach((value, index) => standIn[index] = value) // eslint-disable-line no-return-assign
      standinIndex = standinIndex ? 0 : 1
      return standIn
    },

    add(value) {
      const {id} = value
      if (id) value = id
      $(_ + 'filter/typeof-value')(value, typeofDefaultValue, attributeName, entityType)
      const index = indexesByID[thisID]
      const values = _attribute[index]
      if (typeofDefaultValue === 'integer') {
        const duplicate = values.find(existingValue => existingValue === value)
        if (duplicate) return value
      }
      values.push(value)
      return false
    },

    addMultiple(...values) {
      log.length = 0
      values.forEach((value) => {
        const duplicate = this.add(value)
        if (duplicate) log.push(duplicate)
      })
      return log.length ? log : false
    },

    remove(value) {
      const {id} = value
      if (id) value = id
      const index = indexesByID[thisID]
      const values = _attribute[index]
      const match = values.indexOf(value)
      if (match === -1) return value
      values.splice(match, 1)
      return false
    },

    removeMultiple(...values) {
      log.length = 0
      values.forEach(value => {
        const missing = this.remove(value)
        if (missing) log.push(missing)
      })
      return log.length ? log : false
    },

    removeAll() {
      const index = indexesByID[thisID]
      const values = _attribute[index]
      if (!values.length) return true
      values.length = 0
      return false
    }
  }

  const arrayAttributeMethod = Object.create({}, {[attributeName]: {

    get: function() {
      thisID = this.id
      return arrayAttributeMethods
    },

    enumerable: true
  }})

  return arrayAttributeMethod
}
