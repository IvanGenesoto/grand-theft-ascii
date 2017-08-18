const express = require('express')
const app = express()
const http = require('http')
const server = http.Server(app)
const socket = require('socket.io')
const io = socket(server)
const path = require('path')
const port = process.env.PORT || 3000
const now = require('performance-now')

const state = require('./state')

const {
  players,
  districts,
  rooms,
  characters,
  vehicles
} = state

var bob = characters.create()
characters[bob].name = 'Bob'
console.log(characters[bob].name);

app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => {
  console.log('Listening on port 3000.')
})
