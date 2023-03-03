const express = require("express");
const socketio = require("socket.io");

const app = express();
var cors = require('cors')
const path = require("path");

const users = {};

app.use(express.static("./"));

app.get("/", (req, res) => {
  res.sendFile("/home/praneet/Desktop/practice/sock/index.html");
});

const server = app.listen(8000, () => {
  console.log("Server running!");
});

const io = socketio(server,{
    cors: {
      origin: "http://localhost:8000",
      methods: ["GET", "POST"],
      credentials: true
    }})


io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", { name: users[socket.id], message });
  });

  // if someone leave the chat
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });

  socket.on("private-message", (message) => {
    console.log("Priv", message);
    console.log("user", users);
    socket.broadcast.emit("private-message-recived", {
      id: socket.id,
      message,
    });
  });

  // get all users online
  socket.on("users", () => {
    socket.emit("get-users", users);
  });

  socket.on("send-private-message", (data) => {
    console.log("=>", data);
    socket.to(data.id).emit("recive-private-messgae", data.message);
  });
});
