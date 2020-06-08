export const setInterpolationRatio = state => {
  const {ratioIndex} = state
  const index = ratioIndex === 9 ? 9 : state.ratioIndex++
  state.ratio = ratios[index]
  return state
}

const ratios = [
  0,
  1 / 3,
  2 / 3,
  1,
  4 / 3,
  5 / 3,
  2,
  7 / 3,
  8 / 3,
  3
]
