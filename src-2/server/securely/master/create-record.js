module.exports = function createRecord() {

  const propertyDescriptor = {
    configurable: true,
    enumerable: true,
    writable: true
  }

  const _ = propertyDescriptor

  const record = Object.create(null, {
    players: {value: [0], ..._},
    characters: {value: [0], ..._},
    vehicles: {value: [0], ..._},
    rooms: {value: [0], ..._}
  })

  return record
}
