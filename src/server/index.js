const fs = require('fs')
const path = require('path')
const express = require('express')
const http = require('http')
const socket = require('socket.io')
const now = require('performance-now')
const modules = require('./import-files')({
  module, __dirname, fs, path, socket, now
})

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000
const io = socket(server)

const district = modules.initialize.index()
const {players} = district

require('./initiate')(district)

io.on('connection', socket => require('./connect')(socket, players, now))
app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => console.log('Listening on port ' + port))
