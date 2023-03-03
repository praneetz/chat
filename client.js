const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")



// Function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}


// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(`hurreyyy! ${name} joined the chat`, 'right')
})


// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})


// socket.emit('private-message',)

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'right')
})

socket.on('private-message-recived',data=>{
    console.log("clienID",data.id)
    console.log("clentMess",data.message)
})

// get users
socket.on("get-users",users=>{
    console.log("All users",users)
    append(`${users} left the chat`, 'right')
})

// recive private message
socket.on("recive-private-messgae",message=>{
    console.log("mmmm",message)
    append(`${message}`, 'right')
})
// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    if(message=="show all users"){
        socket.emit("users")
    }
    if(message.length==20){
        socket.emit("send-private-message",{id:message,message:"Hello this is a msg"})
    }
    messageInput.value = ''
})