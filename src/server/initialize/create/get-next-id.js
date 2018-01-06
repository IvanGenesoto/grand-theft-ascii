module.exports = function createGetNextID({
  entityCounts, districtIDsByEntityID, entityCountsByDistrictID
}) {

  return function getNextID() {
    // this = rootAccessorPrototype
    const id = entityCounts.increment.call(this)
    districtIDsByEntityID.add.call(this, id)
    entityCountsByDistrictID.increment.call(this)
    return id
  }
}
