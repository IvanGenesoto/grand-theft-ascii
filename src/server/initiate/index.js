module.exports = function initiate(district) {

  const {
    $, // eslint-disable-line no-unused-vars
    _, // eslint-disable-line no-unused-vars
    players, // eslint-disable-line no-unused-vars
    characters, // eslint-disable-line no-unused-vars
    vehicles, // eslint-disable-line no-unused-vars
    rooms // eslint-disable-line no-unused-vars
  } = district

  const character = characters.create()
  const vehicle = vehicles.create()
  character.vehicleKeys.add(vehicle)
  console.log(character.vehicleKeys.getAll());
  character.driving.set(vehicle)
  console.log(character.driving.get());
}
