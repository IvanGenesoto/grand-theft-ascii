module.exports = function importLoop(importKit, parentObject, fileName) {

  const {nodes, fs, path, directoryPath, importFile, importDirectory} = importKit
  if (nodes.includes(fileName)) return importFile({
    ...importKit, parentObject, name: fileName, filePath: fileName
  })

  const filePath = path.join(directoryPath, fileName)
  const stats = fs.statSync(filePath)
  const {name, ext} = path.parse(filePath)
  importKit = {...importKit, filePath, parentObject, name, ext}
  if (stats.isFile() && ext.toLowerCase() === '.js') return importFile(importKit)
  if (stats.isDirectory()) return importDirectory(importKit)

  return parentObject
}
