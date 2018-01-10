module.exports = function createIndexesById(_entityRoot, entityRootType) {

  return _entityRoot.id.reduce(append, [])

  function append (indexesByID, id, index) {
    indexesByID[id] = index
    return indexesByID
  }
}
