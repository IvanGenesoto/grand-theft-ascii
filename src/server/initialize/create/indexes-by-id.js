module.exports = function createIndexesByID(_entityRoot, entityRootType) {

  return _entityRoot.id.reduce(append, [])

  function append (indexesByID, id, index) {
    indexesByID[id] = index
    return indexesByID
  }
}
