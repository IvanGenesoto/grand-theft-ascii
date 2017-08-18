module.exports = function createAccessor(index, accessorPrototype, entities) {
  entities[index] = Object.create(accessorPrototype, {index: {value: index}})
  return Object.freeze(entities[index])
}
