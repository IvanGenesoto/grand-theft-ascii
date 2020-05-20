const modules = require('./import')(module, __dirname)
const {express, http, socketIo, path, initialize} = modules
const initializeDistrict = initialize.index
const app = express()
const server = http.createServer(app)
const io = modules.io = socketIo(server)
const port = process.env.PORT || 3000
const district = initializeDistrict(modules)

district.initiateDistrict()

io.on('connection', socket => district.handle(socket))
app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => console.log('Listening on port ' + port))
