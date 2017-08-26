module.exports = function createGetNextID(districtID, districtsByID, entityCountsByDistrict) {

  return function getNextID() {
    const rootEntityType = this.entityType
    const id = districtsByID[rootEntityType].length
    districtsByID[rootEntityType][id] = districtID
    entityCountsByDistrict[rootEntityType][districtID]++
    return id
  }
}

// implement Redis
// increment & receive id at entityType
// store districtID to districtsByID -> entityType -> id
// increment entitiyCountsByDistrict -> entityType -> districtID
