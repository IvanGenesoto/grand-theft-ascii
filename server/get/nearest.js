export const getNearest = (reducingKit, vehicleKit, index) => {

  const {timestamp, smallest = Infinity} = reducingKit
  const {timestamp: timestamp_} = vehicleKit
  const difference = Math.abs(timestamp - timestamp_)
  const isSmallest = difference < smallest
  const interpolationOffset = 3

  isSmallest && (reducingKit.smallest = difference)
  isSmallest && (reducingKit.index = index - interpolationOffset)

  return reducingKit
}
