module.exports = function createEntityCountsByDistrictID() {

  const _entityCountsByDistrictID = {
    players: [0],
    characters: [0],
    vehicles: [0],
    rooms: [0]
  }

  return {

    get: function() {
      const entityType = this.entityType
      const districtID = this.districtID
      return _entityCountsByDistrictID[entityType][districtID]
    },

    increment: function() {
      const entityType = this.entityType
      const districtID = this.districtID
      if (!_entityCountsByDistrictID[entityType][districtID]) {
        _entityCountsByDistrictID[entityType][districtID] = 0
      }
      return ++_entityCountsByDistrictID[entityType][districtID]
    }
  }
}
