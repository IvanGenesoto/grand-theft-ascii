module.exports = function createGetNextID({
  entityCounts, districtIDsByEntityID, entityCountsByDistrictID
}) {

  return function getNextID() {
    const rootAccessor = this
    const id = entityCounts.increment.call(rootAccessor)
    districtIDsByEntityID.add.call(rootAccessor, id)
    entityCountsByDistrictID.increment.call(rootAccessor)
    return id
  }
}
