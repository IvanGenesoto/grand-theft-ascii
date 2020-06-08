export const getNearest = (reducingKit, vehicleKit) => {
  const {timestamp, smallest = Infinity} = reducingKit
  const {timestamp: timestamp_} = vehicleKit
  const difference = Math.abs(timestamp - timestamp_)
  const isSmallest = difference < smallest
  isSmallest && (reducingKit.smallest = difference)
  isSmallest && (reducingKit.vehicleKit = vehicleKit)
  return reducingKit
}
