export const createInstance = prototype => Object
  .entries(prototype)
  .reduce(appendAttribute, {})

const appendAttribute = (item, [key, value]) => {
  item[key] =
      Array.isArray(value) ? [...value]
    : value && value === 'object' ? {...value}
    : value
  return item
}
