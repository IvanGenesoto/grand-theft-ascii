module.exports = function createEntityCounts() {

  const _entityCounts = {
    players: 0,
    characters: 0,
    vehicles: 0,
    rooms: 0
  }

  return {

    get() {
      const entityType = this.entityType
      return _entityCounts[entityType]
    },

    increment() {
      const entityType = this.entityType
      return ++_entityCounts[entityType]
    }
  }
}
