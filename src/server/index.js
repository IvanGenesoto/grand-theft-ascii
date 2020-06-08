import express, {static as static_} from 'express'
import {Server} from 'http'
import socketIo from 'socket.io'
import {join} from 'path'
import {state} from './prototypes'
import {initiateCity} from './initiate'
import {handleConnection} from './handle'
import {refresh} from './do'

const app = express()
const server = Server(app)
const io = socketIo(server)
const port = process.env.PORT || 3000

state.io = io
initiateCity(state)
io.on('connection', handleConnection.bind({state}))
app.use(static_(join(__dirname, 'public')))
server.listen(port, () => console.log('Listening on port ' + port))
refresh(state)
