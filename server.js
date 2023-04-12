const express = require("express")
const app = express()
const http = require('http')
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const { Server } = require("socket.io");

const io = new Server(server);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  // Broadcast to all connected clients that a new user has joined
  socket.broadcast.emit("user joined", "A new user has joined the chat");

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    // Broadcast to all connected clients that a user has left
    io.emit('user left', 'A user has left the chat');
  });
});

server.listen(3000, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);;
})
