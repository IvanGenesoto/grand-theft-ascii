module.exports = function importModules(module, __dirname) {

  const importKit = {
    importLoop: module.require('./import/loop'),
    importFile: module.require('./import/file'),
    importDirectory: module.require('./import/directory'),
    makeCamelCase: module.require('./import/make-camel-case'),
    directoryPath: __dirname,
    enumerable: true,
    isNode: true,
    module
  }

  const {importLoop} = importKit
  const boundImportLoop = importLoop.bind(null, importKit)
  const modules = module
    .require('./import/nodes')
    .reduce(boundImportLoop, Object.create(null))

  importKit.isNode = false
  importKit.path = modules.path
  const fs = importKit.fs = modules.fs
  let fileNames = fs.readdirSync(__dirname)

  return Object.freeze(fileNames.reduce(boundImportLoop, modules))
}
