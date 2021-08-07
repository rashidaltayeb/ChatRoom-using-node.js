const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
// get username and room name from url
const {username , room} = Qs.parse(location.search,{
      ignoreQueryPrefix : true
}) 
const socket = io();
//join chat room
socket.emit('joinRoom',{username, room})
// get room and user
socket.on('roomUsers',({room, users}) =>{
      outputRoomName(room)
      outputUsers(users)
})
// sent message to server
socket.on('message', message => {
       console.log(message)
       outputMessage(message)
       // fix scroll down 
       chatMessages.scrollTop = chatMessages.scrollHeight
})
// message sent 
chatForm.addEventListener('submit', e => {
       e.preventDefault()
       // get message text
       const msg = e.target.elements.msg.value
       // emit message to server
       socket.emit('chatMessage',msg)
       // clear the input 
       e.target.elements.msg.value = ''
       e.target.elements.msg.focus()
 })
// Output message to documents
 function outputMessage(message)
 {
       const div = document.createElement('div')
       div.classList.add('message')
       div.innerHTML = `<p class="meta">${message.username}<span>  ${message.time}</span></p>
       <p class="text">
             ${message.text}
       </p>`
       document.querySelector('.chat-messages').appendChild(div)
 }
 // add room name to dom
 function outputRoomName(room) {
       roomName.innerText = room
 }
 // add users to dom
 function outputUsers(users) {
       userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
 }