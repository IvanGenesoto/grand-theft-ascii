module.exports = function createEntityCounts() {

  const entityCounts = {
    players: 0,
    characters: 0,
    vehicles: 0,
    rooms: 0
  }

  return {

    get: function() {
      const entityType = this.entityType
      return entityCounts[entityType]
    },

    increment: function() {
      const entityType = this.entityType
      return ++entityCounts[entityType]
    }
  }
}
