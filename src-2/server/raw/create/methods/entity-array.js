module.exports = function createCommonEntityArrayMethods(
  {thisContainer, integer, typeofDefaultValue, _attribute, attributeName, _indexesByID, entityType, $, _}
) {

  const standIn = []
  const log = []

  return {

    id: 0,

    entityType,

    length: function() {
      const index = _indexesByID[thisContainer.this.id]
      const values = _attribute[index]
      return values.length
    },

    get: function() {
      standIn.length = 0
      const index = _indexesByID[thisContainer.this.id]
      const values = _attribute[index]
      values.forEach((value, index) => standIn[index] = value) // eslint-disable-line no-return-assign
      return standIn
    },

    add: function(value) {
      if (integer && value.id) value = value.id
      $(_ + 'filter/typeof-value')(
        value, integer, typeofDefaultValue, attributeName, entityType
      )
      const index = _indexesByID[thisContainer.this.id]
      const values = _attribute[index]
      const duplicate = values.find(existingValue => existingValue === value)
      if (duplicate) return false
      values.push(value)
      return true
    },

    addMultiple: function(...values) {
      log.length = 0
      values.forEach(value => {
        const result = thisContainer.this[attributeName].add(value)
        log.push(result)
      })
      const anyFalse = log.find(result => result === false)
      if (anyFalse) return log
      return true
    },

    remove: function(value) {
      const index = _indexesByID[thisContainer.this.id]
      const values = _attribute[index]
      const match = values.indexOf(value)
      if (match === -1) return false
      values.splice(match, 1)
      return true
    },

    removeMultiple: function(...values) {
      log.length = 0
      values.forEach(value => {
        const result = thisContainer.this[attributeName].remove(value)
        log.push(result)
      })
      const anyFalse = log.find(result => result === false)
      if (anyFalse) return log
      return true
    },

    removeAll: function() {
      const index = _indexesByID[thisContainer.this.id]
      const values = _attribute[index]
      if (!values.length) return false
      values.length = 0
      return true
    }
  }
}
