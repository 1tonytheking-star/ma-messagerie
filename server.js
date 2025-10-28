import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static("public"));
app.use(express.json());

const dataDir = path.join(__dirname, "data");
const messagesFile = path.join(dataDir, "messages.json");

// Crée le dossier et le fichier si manquants
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(messagesFile)) fs.writeFileSync(messagesFile, JSON.stringify({}));

let users = {}; // socketId → { name, surname, code }

// Charger les anciens messages
function loadMessages() {
  if (fs.existsSync(messagesFile)) {
    return JSON.parse(fs.readFileSync(messagesFile, "utf8"));
  }
  return {};
}

// Sauvegarder les messages
function saveMessages(data) {
  fs.writeFileSync(messagesFile, JSON.stringify(data, null, 2));
}

let messages = loadMessages();

// ➕ Connexion
io.on("connection", (socket) => {
  console.log("Nouvelle connexion :", socket.id);

  socket.on("login", ({ name, surname, code }) => {
    users[socket.id] = { name, surname, code };
    io.emit("userList", Object.values(users));
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("userList", Object.values(users));
  });

  socket.on("privateMessage", ({ to, from, message }) => {
    const pairId = [from.code, to.code].sort().join("-");
    if (!messages[pairId]) messages[pairId] = [];
    messages[pairId].push({ from, message, timestamp: Date.now() });
    saveMessages(messages);

    for (let id in users) {
      if (users[id].code === to.code || users[id].code === from.code) {
        io.to(id).emit("privateMessage", { from, to, message });
      }
    }
  });

  socket.on("getConversation", ({ from, to }) => {
    const pairId = [from.code, to.code].sort().join("-");
    socket.emit("conversationData", messages[pairId] || []);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
