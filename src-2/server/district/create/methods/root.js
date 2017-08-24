module.exports = function createMethodsForRootAccessorProtoType(args) {
  const {_entities, indexesByID, entityType, districtID, getNextID, accessorPrototype} = args

  const methodsForRootAccessorProtoType = {

    entityType: entityType + 's',

    get length() {
      return _entities.id.length
    },

    create: () => {
      const $ = require
      const id = getNextID(entityType, districtID)
      const index = $('../../create/entity')(id, _entities)
      indexesByID[id] = index
      const accessor = $('../../create/accessor')(id, accessorPrototype)
      return accessor
    }
  }

  return methodsForRootAccessorProtoType
}
