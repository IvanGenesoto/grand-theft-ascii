const express = require('express')
const app = express()
const http = require('http')
const server = http.Server(app)
const socket = require('socket.io')
const io = socket(server) // eslint-disable-line no-unused-vars
const path = require('path')
const port = process.env.PORT || 3000
const now = require('performance-now') // eslint-disable-line no-unused-vars

const state = require('./restricted/state')

const {
  players, // eslint-disable-line no-unused-vars
  districts, // eslint-disable-line no-unused-vars
  rooms, // eslint-disable-line no-unused-vars
  characters, // eslint-disable-line no-unused-vars
  vehicles // eslint-disable-line no-unused-vars
} = state

app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => {
  console.log('Listening on port 3000.')
})
