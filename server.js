const express = require("express")
const app = express()
const http = require('http')
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const { Server } = require("socket.io");

const io = new Server(server);

const users = {};



app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  // Broadcast to all connected clients that a new user has joined
   socket.on("nickname", (nickname) => {
     users[socket.id] = nickname;
     socket.broadcast.emit("user joined", `${nickname} has joined the chat`);
   });

    socket.on("chat message", (msg) => {
      console.log("message: " + msg);
      const nickname = users[socket.id];
      io.emit("chat message", { nickname, message: msg });
    });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const nickname = users[socket.id];
    socket.broadcast.emit("user left", `${nickname} has left the chat`);
    delete users[socket.id];
  });
});

server.listen(3000, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);;
})
