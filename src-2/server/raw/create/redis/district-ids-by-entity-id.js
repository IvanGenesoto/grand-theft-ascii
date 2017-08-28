module.exports = function createDistrictIDsByEntityID() {

  const _districtIDsByEntityID = {
    players: [0],
    characters: [0],
    vehicles: [0],
    rooms: [0]
  }

  return {

    get: function(id) {
      const entityType = this.entityType
      return _districtIDsByEntityID[entityType][id]
    },

    add: function(id) {
      const districtID = this.districtID
      const entityType = this.entityType
      _districtIDsByEntityID[entityType][id] = districtID
    }
  }
}
