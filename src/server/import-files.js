module.exports = function importFiles({module, __dirname, fs, path, ...imports}) {

  const kit = {module, __dirname, fs, path, loop, camelize, importFile, importDirectory}
  const boundLoop = loop.bind(null, kit)
  let fileNames = fs.readdirSync(__dirname)

  return Object.freeze(fileNames.reduce(boundLoop, {...imports}))

  function loop(kit, parent, fileName) {
    const {__dirname, path, fs, camelize, importFile, importDirectory} = kit
    const filePath = path.join(__dirname, fileName)
    const stats = fs.statSync(filePath)
    let {name, ext} = path.parse(filePath)
    const l = name.length
    for (let i = 0; i < l; i++) if (name[i] === '-') name = camelize(name, i)
    kit = {filePath, parent, name, ext, ...kit}
    if (stats.isFile()) return importFile(kit)
    if (stats.isDirectory()) return importDirectory(kit)
    else return parent
  }

  function camelize(name, i) {
    return name.slice(0, i) + name[i + 1].toUpperCase() + name.slice(i + 2)
  }

  function importFile({filePath, parent, name, ext, module}) {
    if (ext.toLowerCase() !== '.js') return parent
    const value = module.require(filePath)
    Object.defineProperty(parent, name, {value, enumerable: true})
    return parent
  }

  function importDirectory({filePath, parent, name, fs, loop}) {
    if (name === 'public') return parent
    const descriptor = {value: {}, enumerable: true}
    const {[name]: child} = Object.defineProperty(parent, name, descriptor)
    const fileNames = fs.readdirSync(filePath)
    const boundLoop = loop.bind(null, {...kit, __dirname: filePath})
    parent[name] = fileNames.reduce(boundLoop, child)
    return parent
  }
}
