import express, {static as static_} from 'express'
import {createServer} from 'http'
import socketIo from 'socket.io'
import {join} from 'path'
import now from 'performance-now'
import {statePrototype, initiateCity, pipe, handleSocket, refresh, saveState} from '..'

export const initiateServer = (_state, redis, isProduction) => {

  const app = express()
  const server = createServer(app)
  const io = socketIo(server)
  const path = join(__dirname, '..', 'public')
  const use = app.use.bind(app)
  const state = _state || statePrototype
  const {PORT = 3000} = process.env
  const log = () => isProduction || console.info('Listening on port ' + PORT)

  state.io = io
  state.now = now
  state.delayKit = {}
  state.vehicleKits = []
  state.connectionQueue = []
  state.noTokenQueue = []
  state.tokenQueue = []
  state.latencyQueue = []
  state.inputQueue = []
  _state || initiateCity(state)
  pipe(path, static_, use)
  io.on('connection', handleSocket.bind({state, isProduction}))
  server.listen(PORT, log)
  refresh(state)
  setInterval(saveState, 1000, state, redis)
}
