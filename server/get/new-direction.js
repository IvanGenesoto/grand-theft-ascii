export const getNewDirection = ({up, down, left, right}) =>
    up && left ? 'up-left'
  : up && right ? 'up-right'
  : down && left ? 'down-left'
  : down && right ? 'down-right'
  : up ? 'up'
  : down ? 'down'
  : left ? 'left'
  : right ? 'right'
  : null
