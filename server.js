const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname));

let users = [];

io.on("connection", (socket) => {
  socket.on("newUser", (user) => {
    user.socketId = socket.id;
    user.online = true;
    users.push(user);
    io.emit("userList", users);
  });

  socket.on("disconnect", () => {
    users = users.map(u => (u.socketId === socket.id ? { ...u, online: false } : u));
    io.emit("userList", users);
  });

  socket.on("privateMessage", (data) => {
    const target = users.find(u => u.code === data.to);
    if (target && target.socketId) {
      io.to(target.socketId).emit("message", data);
    }
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`✅ Serveur en ligne sur le port ${PORT}`));
