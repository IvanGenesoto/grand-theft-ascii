export const doesTickMatch = function ({characters}) {
  const {tick} = this
  const [mayor] = characters
  const {tick: tick_} = mayor
  return tick_ === tick
}

export const isEntityOffScreen = ({xInCamera, yInCamera, entity, camera}) =>
     xInCamera > camera.width
  || xInCamera < 0 - entity.width
  || yInCamera > camera.height
  || yInCamera < 0 - entity.height

export const shouldEntityBeFlipped = (direction, previousDirection) =>
     direction === 'left'
  || direction === 'up-left'
  || direction === 'down-left'
  || (direction === 'up' && previousDirection === 'left')
  || (direction === 'up' && previousDirection === 'up-left')
  || (direction === 'up' && previousDirection === 'down-left')
  || (direction === 'down' && previousDirection === 'left')
  || (direction === 'down' && previousDirection === 'up-left')
  || (direction === 'down' && previousDirection === 'down-left')
