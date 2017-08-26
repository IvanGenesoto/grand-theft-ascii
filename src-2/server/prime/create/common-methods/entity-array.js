module.exports = function createCommonEntityArrayMethods(
  {integer, typeofDefaultValue, attributeName, _entities, indexesByID, entityType, $}
) {

  const attribute = _entities[attributeName]
  const standIn = []
  const log = []

  return {

    entityType,

    length: function() {
      const index = indexesByID[this.id]
      const values = attribute[index]
      return values.length
    },

    get: function() {
      standIn.length = 0
      const index = indexesByID[this.id]
      const values = attribute[index]
      values.forEach((value, index) => standIn[index] = value) // eslint-disable-line no-return-assign
      return standIn
    },

    add: function(value) {
      $('../../filter/typeof')(
        value, integer, typeofDefaultValue, attributeName, entityType
      )
      const index = indexesByID[this.id]
      const values = attribute[index]
      const duplicate = values.find(existingValue => existingValue === value)
      if (duplicate) return false
      values.push(value)
      return true
    },

    addMultiple: function(values) {
      log.length = 0
      values.forEach(value => {
        const result = this[attributeName].add(value)
        log.push(result)
      })
      const anyFalse = log.find(result => result === false)
      if (anyFalse) return log
      return true
    },

    remove: function(value, attributeName) {
      const index = indexesByID[this.id]
      const values = attribute[index]
      const match = values.indexOf(value)
      if (match === -1) return false
      values.splice(match, 1)
      return true
    },

    removeMultiple: function(values) {
      log.length = 0
      values.forEach(value => {
        const result = this[attributeName].remove(value)
        log.push(result)
      })
      const anyFalse = log.find(result => result === false)
      if (anyFalse) return log
      return true
    },

    removeAll: function(attributeName) {
      const index = indexesByID[this.id]
      const values = attribute[index]
      if (!values.length) return false
      values.length = 0
      return true
    }
  }
}
