export const isVehicleStrafing = (direction, newDirection) =>
     (direction === 'up-right' && newDirection === 'up')
  || (direction === 'up-right' && newDirection === 'right')
  || (direction === 'right' && newDirection === 'up-right')
  || (direction === 'right' && newDirection === 'down-right')
  || (direction === 'down-right' && newDirection === 'right')
  || (direction === 'down-right' && newDirection === 'down')
  || (direction === 'down-left' && newDirection === 'down')
  || (direction === 'down-left' && newDirection === 'left')
  || (direction === 'left' && newDirection === 'down-left')
  || (direction === 'left' && newDirection === 'up-left')
  || (direction === 'up-left' && newDirection === 'left')
  || (direction === 'up-left' && newDirection === 'up')
