module.exports = function getPropertyType(methodName) {
  const changed = {}
  if (!(methodName.startsWith('get') || methodName.startsWith('set'))) return
  changed.key = (methodName.charAt(0) === 'g') ? 'get' : 'set'
  changed.methodName = methodName.charAt(3).toLowerCase() + methodName.slice(4)
  return changed
}
