module.exports = function createEntityType(rootEntityType) {

  if (rootEntityType.endsWith('ies')) {
    return rootEntityType
      .slice(0, rootEntityType.length - 3)
      .concat('y')
  }

  else if (rootEntityType.endsWith('s')) {
    return rootEntityType
      .slice(0, rootEntityType.length - 1)
  }

  else return rootEntityType
}
