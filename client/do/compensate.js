export const compensate = (delayDuration, delayKit) =>
     delayDuration > delayKit.delay * 1.2
  && (delayKit.hasSlowdown = true)
  && (delayKit.slowdownCompensation = delayKit.delay / delayDuration)
