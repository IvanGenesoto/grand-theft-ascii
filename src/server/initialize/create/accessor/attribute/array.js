module.exports = function createArrayAttributeAccessor({
  _attribute, attributeName, caller, entityType, indexesByID, typeofDefaultValue, modules
}) {

  const log = []
  const cashes = [[], []]
  let casheIndex = 0

  return Object.freeze({

    getLength() {
      const index = indexesByID[caller.id]
      const values = _attribute[index]
      return values.length
    },

    getAll() {
      const cashe = cashes[casheIndex]
      cashe.length = 0
      const index = indexesByID[caller.id]
      const values = _attribute[index]
      values.forEach((value, index) => (cashe[index] = value))
      casheIndex = casheIndex ? 0 : 1
      return cashe
    },

    add(value) {
      const {id} = value || {}
      if (id) value = id
      modules.initialize.filter.typeofValue(value, typeofDefaultValue, attributeName, entityType)
      const index = indexesByID[caller.id]
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
      const {id} = value || {}
      if (id) value = id
      const index = indexesByID[caller.id]
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
      const index = indexesByID[caller.id]
      const values = _attribute[index]
      if (!values.length) return true
      values.length = 0
      return false
    }
  })
}
