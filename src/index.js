const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('New connection')

  socket.emit('message', 'Welcome!')
  socket.broadcast.emit('message', 'A new user has joined')

  socket.on('sendMessage', (message, callback) => {
    io.emit('message', message)
    callback('delivered')
  })

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    io.emit('message', `http://google.com/maps?q=${latitude},${longitude}`)
    callback()
  })

  socket.on('disconnect', () => {
    io.emit('message', 'a user has left')
  })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})