module.exports = function createGetNextID(
  districtID, districtsByID, entityCountsByDistrict
) {

  function getNextID(entityType) {
    const id = districtsByID[entityType].length
    districtsByID[entityType][id] = districtID
    entityCountsByDistrict[entityType][districtID]++
    return id
  }

  return getNextID
}

// implement Redis
// increment & receive id at entityType
// store districtID to districtsByID -> entityType -> id
// increment entitiyCountsByDistrict -> entityType -> districtID
