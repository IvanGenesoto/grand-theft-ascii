export const createStorage = () => {

  const getIsSupported = () => {
    try {
      const testKey = '9F076EDF'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
      return true
    }
    catch (unused) { }
  }

  const clear = () => isSupported
    ? storage.clear()
    : storage = {}

  const getItem = name => isSupported
    ? getJsonItem(name)
    : getNullIfUndefined(storage[name])

  const getJsonItem = name => {
    const item = storage.getItem(name)
    try {
      return JSON.parse(item)
    }
    catch (unused) { }
  }

  const getNullIfUndefined = value => value === undefined
    ? null
    : value

  const key = index => isSupported
    ? storage.key(index)
    : Object.keys(storage)[index] || null

  const removeItem = name => isSupported
    ? storage.removeItem(name)
    : delete storage[name]

  const setItem = (name, value) => name && typeof name === 'object'
    ? Object.entries(name).forEach(([name, value]) => setItem_(name, value))
    : setItem_(name, value)

  const setItem_ = (name, value) => isSupported
    ? storage.setItem(name, JSON.stringify(value))
    : storage[name] = JSON.stringify(value)

  const getLength = () => isSupported
    ? storage.length
    : Object.keys(storage).length

  const isSupported = getIsSupported()

  let storage = isSupported ? localStorage : {}

  return {
    clear,
    getItem,
    key,
    removeItem,
    setItem,
    get length() {
      return getLength()
    }
  }
}
