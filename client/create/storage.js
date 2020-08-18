export const createStorage = namespace => {

  const getName = name => namespace ? `${namespace}.${name}` : name

  const getIsSupported = () => {
    try {
      const testKey = '9F076EDF'
      localStorage.setItem(testKey, testKey)
      localStorage.removeItem(testKey)
      return true
    }
    catch { }
  }

  const clear = () => isSupported
    ? storage.clear()
    : storage = {}

  const getItem = name => isSupported
    ? getJsonItem(name)
    : getNullIfUndefined(storage[getName(name)])

  const getJsonItem = name => {
    const item = storage.getItem(getName(name))
    try {
      return JSON.parse(item)
    }
    catch { }
  }

  const getNullIfUndefined = value => value === undefined
    ? null
    : value

  const key = index => isSupported
    ? storage.key(index)
    : Object.keys(storage)[index] || null

  const removeItem = name => isSupported
    ? storage.removeItem(getName(name))
    : delete storage[getName(name)]

  const setItem = (name, value) => name && typeof name === 'object'
    ? Object.entries(name).forEach(([name, value]) => setItem_(name, value))
    : setItem_(name, value)

  const setItem_ = (name, value) => isSupported
    ? storage.setItem(getName(name), JSON.stringify(value))
    : storage[getName(name)] = JSON.stringify(value)

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
