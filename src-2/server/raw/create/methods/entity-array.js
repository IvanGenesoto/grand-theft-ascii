module.exports = function createUniversalEntityArrayMethods(
  {
    idCashe, integer, typeofDefaultValue, _attribute, attributeName,
      indexesByID, entityType, rootEntityType, district, $, _
    }
) {

  const standIn = []
  const log = []

  return {

    get length() {
      const index = indexesByID[idCashe.id]
      const values = _attribute[index]
      return values.length
    },

    get all() {
      standIn.length = 0
      const index = indexesByID[idCashe.id]
      const values = _attribute[index]
      values.forEach((value, index) => standIn[index] = value) // eslint-disable-line no-return-assign
      return standIn
    },

    add(value) {
      if (integer && value.id) value = value.id
      $(_ + 'filter/typeof-value')(
        value, integer, typeofDefaultValue, attributeName, entityType
      )
      const index = indexesByID[idCashe.id]
      const values = _attribute[index]
      const duplicate = values.find(existingValue => existingValue === value)
      if (duplicate) return false
      values.push(value)
      return true
    },

    addMultiple(...values) {
      log.length = 0
      values.forEach(value => {
        const result = district[rootEntityType][idCashe.id][attributeName].add(value)
        log.push(result)
      })
      const anyFalse = log.find(result => result === false)
      if (anyFalse) return log
      return true
    },

    remove(value) {
      const index = indexesByID[idCashe.id]
      const values = _attribute[index]
      const match = values.indexOf(value)
      if (match === -1) return false
      values.splice(match, 1)
      return true
    },

    removeMultiple(...values) {
      log.length = 0
      values.forEach(value => {
        const result = district[rootEntityType][idCashe.id][attributeName].remove(value)
        log.push(result)
      })
      const anyFalse = log.find(result => result === false)
      if (anyFalse) return log
      return true
    },

    removeAll() {
      const index = indexesByID[idCashe.id]
      const values = _attribute[index]
      if (!values.length) return false
      values.length = 0
      return true
    }
  }
}
