import express, {static as static_} from 'express'
import {createServer} from 'http'
import socketIo from 'socket.io'
import {join} from 'path'
import now from 'performance-now'
import {statePrototype, initiateCity, pipe, handleSocket, refresh, saveState} from '..'

export const initiateServer = (_state, redis, isProduction) => {

  const {env: environment} = process
  const {PORT} = environment
  const app = express()
  const server = createServer(app)
  const io = socketIo(server)
  const port = PORT || 3000
  const path = join(__dirname, '..', 'public')
  const use = app.use.bind(app)
  const state = _state || statePrototype
  const callback = () => isProduction || console.log('Listening on port ' + port)

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
  server.listen(port, callback)
  refresh(state)
  setInterval(saveState, 1000, state, redis)
}
