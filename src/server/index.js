const modules = require('./import')(module, __dirname)

const {express, http, path, initialize, initiate} = modules
const {initializeDistrict} = initialize
const {initiateDistrict} = initiate

const app = express()
const server = modules.server = http.createServer(app)

initiateDistrict(initializeDistrict(modules))

app.use(express.static(path.join(__dirname, 'public')))
const port = process.env.PORT || 3000
server.listen(port, () => console.log('Listening on port ' + port))
