module.exports = function createGetNextID({
  entityCounts, districtIDsByEntityID, entityCountsByDistrictID
}) {

  return function getNextID() {
    const rootAccessorPrototype = this
    const id = entityCounts.increment.call(rootAccessorPrototype)
    districtIDsByEntityID.add.call(rootAccessorPrototype, id)
    entityCountsByDistrictID.increment.call(rootAccessorPrototype)
    return id
  }
}
