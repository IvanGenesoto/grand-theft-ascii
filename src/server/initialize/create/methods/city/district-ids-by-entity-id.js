module.exports = function createDistrictIDsByEntityID(modules) {
  const {filter} = modules.initialize

  const _districtIDsByEntityID = {
    players: [0],
    characters: [0],
    vehicles: [0],
    rooms: [0]
  }

  return {

    get(id) {
      const entityType = this.entityType
      return _districtIDsByEntityID[entityType][id]
    },

    add(id) {
      const districtID = this.districtID
      const entityType = this.entityType
      filter.typeofValue(id, 'integer', '', 'id', entityType)
      filter.typeofValue(districtID, 'integer', '', 'districtID', entityType)
      _districtIDsByEntityID[entityType][id] = districtID
    }
  }
}
