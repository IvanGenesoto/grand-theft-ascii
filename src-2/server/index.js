const district = 1

const $ = require
const express = $('express')
const app = express()
const server = $('http').Server(app)
const socket = $('socket.io')
const io = socket(server) // eslint-disable-line no-unused-vars
const path = $('path')
const port = process.env.PORT || 3000
const now = $('performance-now') // eslint-disable-line no-unused-vars

const state = $('./secure/state')(district)

const {
  entityCounts, // eslint-disable-line no-unused-vars
  entityDistricts, // eslint-disable-line no-unused-vars
  entityIndexes, // eslint-disable-line no-unused-vars
  entities
} = state

const {
  players, // eslint-disable-line no-unused-vars
  districts, // eslint-disable-line no-unused-vars
  rooms, // eslint-disable-line no-unused-vars
  characters, // eslint-disable-line no-unused-vars
  vehicles // eslint-disable-line no-unused-vars
} = entities

app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => {
  console.log('Listening on port 3000.')
})
