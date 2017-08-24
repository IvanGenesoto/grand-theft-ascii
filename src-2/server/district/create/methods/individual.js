module.exports = function createIndividualMethodsForAccessorPrototype(
  {_entities, entityType, indexesByID}) {

  const methodsForAccessorPrototype = {

    entityType,

    length: function(attributeName) {
      const attribute = _entities[attributeName]
      const index = indexesByID[this.id]
      const items = attribute[index]
      return items.length
    },

    add: function(item, attributeName) {
      const attribute = _entities[attributeName]
      const index = indexesByID[this.id]
      const items = attribute[index]
      const duplicate = items.find(existingItem => existingItem === item)
      if (duplicate) return false
      else {
        items.push(item)
        return true
      }
    },

    remove: function(item, attributeName) {
      const attribute = _entities[attributeName]
      const index = indexesByID[this.id]
      const items = attribute[index]
      const match = items.indexOf(item)
      if (match === -1) return false
      else {
        items.splice(match, 1)
        return true
      }
    },

    removeAll: function(attributeName) {
      const index = indexesByID[this.id]
      const attribute = _entities[attributeName]
      const items = attribute[index]
      if (!items.length) return false
      items.length = 0
      return true
    }

  }
  return methodsForAccessorPrototype
}
