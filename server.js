const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./app/message')
const {userJoin, getCurrentUser,userLeave,getRoomUsers} = require('./app/users')
// config 
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const botName = 'BotMeassage'
// set static folder
app.use(express.static(path.join(__dirname, 'public')))
// Run when client connects
io.on('connection', socket => {
      socket.on('joinRoom',({username , room}) => {
            const user = userJoin(socket.id,username,room)
            socket.join(user.room)
            // Welcome message to the current user
            socket.emit('message', formatMessage(botName,'welcome to chat room'))
            // broadcst when user connect
            socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`))
            // send users and room info
            io.to(user.room).emit('roomUsers', {
                  room : user.room,
                  users: getRoomUsers(user.room)
            })
      })
      // listen for chatMessage
      socket.on('chatMessage', msg => {
            const user = getCurrentUser(socket.id)
            io.to(user.room).emit('message',formatMessage(user.username,msg))
      })
      // tell all users the user has been out
      socket.on('disconnect', ()=>{
            const user = userLeave(socket.id)
            if (user) {
                  io.to(user.room).emit('message',formatMessage(botName,`${user.username} the user has left the chat`))
                  // send users and room info
                  io.to(user.room).emit('roomUsers', {
                        room : user.room,
                        users: getRoomUsers(user.room)
                  })
            }
      })
})
// create the port to the server
const port = 3000 || process.env.port
// port listening 
server.listen(port, () => console.log(`server is running on port : ${port}`))