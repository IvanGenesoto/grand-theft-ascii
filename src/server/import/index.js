module.exports = function importModules(module, __dirname) {

  const nodes = {}

  module.require('./import/nodes').forEach(node => {
    let name = node
    const l = name.length
    for (let i = 0; i < l; i++) {
      if (name[i] === '-' || name[i] === '.') name = camelize(name, i)
    }
    nodes[name] = module.require(node)
  })

  const {fs, path} = nodes
  const boundLoop = loop.bind(null, __dirname)
  let fileNames = fs.readdirSync(__dirname)

  return Object.freeze(fileNames.reduce(boundLoop, {...nodes}))

  function camelize(name, i) {
    return name.slice(0, i) + name[i + 1].toUpperCase() + name.slice(i + 2)
  }

  function loop(directoryName, parent, fileName) {
    const filePath = path.join(directoryName, fileName)
    const stats = fs.statSync(filePath)
    let {name, ext} = path.parse(filePath)
    const l = name.length
    for (let i = 0; i < l; i++) if (name[i] === '-') name = camelize(name, i)
    if (stats.isFile()) return importFile(filePath, parent, name, ext)
    if (stats.isDirectory()) return importDirectory(filePath, parent, name)
    else return parent
  }

  function importFile(filePath, parent, name, ext) {
    if (ext.toLowerCase() !== '.js') return parent
    const value = module.require(filePath)
    if (typeof value === 'function' && value.name) name = value.name
    Object.defineProperty(parent, name, {value, enumerable: true})
    return parent
  }

  function importDirectory(filePath, parent, name) {
    if (name === 'public') return parent
    const descriptor = {value: {}, enumerable: true}
    const {[name]: child} = Object.defineProperty(parent, name, descriptor)
    const fileNames = fs.readdirSync(filePath)
    const boundLoop = loop.bind(null, filePath)
    parent[name] = fileNames.reduce(boundLoop, child)
    return parent
  }
}
