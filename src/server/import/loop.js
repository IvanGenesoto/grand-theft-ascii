module.exports = function importLoop(importKit, parentObject, fileName) {
  const {isNode, fs, path, directoryPath, importFile, importDirectory} = importKit
  if (isNode) {
    return importFile({...importKit, parentObject, name: fileName, filePath: fileName})
  }
  else {
    var filePath = path.join(directoryPath, fileName)
    var stats = fs.statSync(filePath)
    var {name, ext} = path.parse(filePath)
  }
  importKit = {...importKit, filePath, parentObject, name, ext}
  if (stats.isFile() && ext.toLowerCase() === '.js') return importFile(importKit)
  if (stats.isDirectory()) return importDirectory(importKit)
  return parentObject
}
