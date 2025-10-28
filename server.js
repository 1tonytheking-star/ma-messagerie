const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let users = [];

io.on("connection", (socket) => {
  console.log("Nouvelle connexion");

  socket.on("login", (user) => {
    const existing = users.find(u => u.nom === user.nom && u.prenom === user.prenom && u.code === user.code);
    if (existing) {
      existing.online = true;
      existing.id = socket.id;
    } else {
      users.push({ ...user, id: socket.id, online: true });
    }
    io.emit("updateUsers", users);
  });

  socket.on("disconnect", () => {
    const user = users.find(u => u.id === socket.id);
    if (user) user.online = false;
    io.emit("updateUsers", users);
  });

  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", msg);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Serveur en ligne sur le port ${PORT}`));
