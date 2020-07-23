export const categorize = (activesByCategory, character) => {

  const {walkers, drivers, passengers} = activesByCategory
  const {drivingId, passengingId} = character

  const entities =
      drivingId ? drivers
    : passengingId ? passengers
    : walkers

  entities.push(character)

  return activesByCategory
}
