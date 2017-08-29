module.exports = function initiate(district) {

  const {
    players, // eslint-disable-line no-unused-vars
    characters, // eslint-disable-line no-unused-vars
    vehicles, // eslint-disable-line no-unused-vars
    rooms // eslint-disable-line no-unused-vars
  } = district

  const character1 = characters.create()
  const vehicle1 = vehicles.create()
  character1.vehicleKeys = vehicle1
  const character2 = characters.create()
  const vehicle2 = vehicles.create()
  character2.vehicleKeys.addMultiple(vehicle2, vehicle1)
  console.log(character2.vehicleKeys.all);
}
