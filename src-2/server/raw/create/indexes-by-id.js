module.exports = function createIndexesById(_entities, rootEntityType) {

  const indexesByID = []

  _entities.id.forEach((id, index) => indexesByID[id] = index) // eslint-disable-line no-return-assign

  return indexesByID
}
