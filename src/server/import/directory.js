module.exports = function importDirectory(importKit) {
  let {filePath, fs, importLoop, enumerable, parentObject, name, makeCamelCase} = importKit
  if (name === 'public') return parentObject
  const descriptor = {value: Object.create(null), enumerable}
  name = makeCamelCase(name)
  const {[name]: directoryObject} = Object.defineProperty(parentObject, name, descriptor)
  const fileNames = fs.readdirSync(filePath)
  importKit = {...importKit, directoryPath: filePath}
  const boundImportLoop = importLoop.bind(null, importKit)
  parentObject[name] = Object.freeze(fileNames.reduce(boundImportLoop, directoryObject))
  return parentObject
}
