export const pipe = (...functions) => functions.reduce(callFunction)

const callFunction = (argument, function_) => function_(argument)
