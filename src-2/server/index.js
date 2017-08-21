const $ = require
const express = $('express')
const app = express()
const path = $('path')
const port = process.env.PORT || 3000
const server = $('http').Server(app)
const socket = $('socket.io')
const io = socket(server)
const districtID = $('securely/access/district-id')

const {
  rootAccessors,
  Master
} = $('securely/get-root-accessors')(districtID, io)

$('./main')(rootAccessors)

$('./connection')(io, Master)

app.use(express.static(path.join(__dirname, 'public')))
server.listen(port, () => {
  console.log('Listening on port 3000.')
})
