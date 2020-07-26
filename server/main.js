import express, {static as static_} from 'express'
import {createServer} from 'http'
import socketIo from 'socket.io'
import {join} from 'path'
import {state, initiateCity, handleConnection, refresh} from '.'

const app = express()
const server = createServer(app)
const io = socketIo(server)
const port = process.env.PORT || 3000

state.io = io
initiateCity(state)
io.on('connection', handleConnection.bind({state}))
app.use(static_(join(__dirname, 'public')))
server.listen(port, () => console.log('Listening on port ' + port))
refresh(state)
