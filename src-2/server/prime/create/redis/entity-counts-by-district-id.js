module.exports = function createEntityCountsByDistrictID() {

  const entityCountsByDistrictID = {
    players: [0],
    characters: [0],
    vehicles: [0],
    rooms: [0]
  }

  return {

    get: function() {
      const entityType = this.entityType
      const districtID = this.districtID
      return entityCountsByDistrictID[entityType][districtID]
    },

    increment: function() {
      const entityType = this.entityType
      const districtID = this.districtID
      if (!entityCountsByDistrictID[entityType][districtID]) {
        entityCountsByDistrictID[entityType][districtID] = 0
      }
      return ++entityCountsByDistrictID[entityType][districtID]
    }
  }
}
