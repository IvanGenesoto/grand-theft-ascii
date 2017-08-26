module.exports = function createDistrictIDsByEntityID() {

  const districtIDsByEntityID = {
    players: [0],
    characters: [0],
    vehicles: [0],
    rooms: [0]
  }

  return {

    get: function(id) {
      const entityType = this.entityType
      return districtIDsByEntityID[entityType][id]
    },

    add: function(id) {
      const districtID = this.districtID
      const entityType = this.entityType
      districtIDsByEntityID[entityType][id] = districtID
    }
  }
}
