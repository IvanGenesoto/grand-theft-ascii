module.exports = function importModules(module, __dirname) {

  let importKit = {
    importLoop: module.require('./import/loop'),
    importFile: module.require('./import/file'),
    importDirectory: module.require('./import/directory'),
    makeCamelCase: module.require('./import/make-camel-case'),
    nodes: module.require('./import/nodes'),
    directoryPath: __dirname,
    enumerable: true,
    module
  }

  const {importLoop, nodes} = importKit
  let boundImportLoop = importLoop.bind(null, importKit)
  const initialize = nodes.reduce(boundImportLoop, Object.create(null))

  const {fs, path} = initialize
  const directoryPath = __dirname
  importKit = {...importKit, fs, path, directoryPath}
  boundImportLoop = importLoop.bind(null, importKit)
  const fileNames = fs.readdirSync(directoryPath)

  return fileNames.reduce(boundImportLoop, initialize)
}
