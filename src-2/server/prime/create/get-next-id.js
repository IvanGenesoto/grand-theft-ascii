module.exports = function createGetNextID(
  {entityCounts, districtIDsByEntityID, entityCountsByDistrictID}
) {

  return function getNextID() {
    const entityType = this.entityType
    const districtID = this.districtID
    const id = entityCounts.increment()
    districtIDsByEntityID.add.call(this, id)
    entityCountsByDistrictID[entityType][districtID]++
    return id
  }
}
