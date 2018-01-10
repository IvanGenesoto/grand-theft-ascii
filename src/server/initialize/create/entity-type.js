module.exports = function createEntityType(entityRootType) {

  if (entityRootType.endsWith('ies')) {
    return entityRootType
      .slice(0, entityRootType.length - 3)
      .concat('y')
  }

  else if (entityRootType.endsWith('s')) {
    return entityRootType
      .slice(0, entityRootType.length - 1)
  }

  else return entityRootType
}
