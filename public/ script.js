const socket = io();
let currentUser = JSON.parse(localStorage.getItem("user"));

function login() {
  const user = {
    prenom: document.getElementById("prenom").value,
    nom: document.getElementById("nom").value,
    code: document.getElementById("code").value
  };

  localStorage.setItem("user", JSON.stringify(user));
  socket.emit("login", user);
  window.location.href = "chat.html";
}

if (window.location.pathname.endsWith("chat.html")) {
  if (!currentUser) window.location.href = "index.html";

  socket.emit("login", currentUser);

  socket.on("updateUsers", (users) => {
    const usersDiv = document.getElementById("users");
    usersDiv.innerHTML = "";
    users.forEach(u => {
      const div = document.createElement("div");
      div.innerHTML = `${u.prenom} ${u.nom} <span style="color:${u.online ? 'green' : 'red'};">●</span>`;
      usersDiv.appendChild(div);
    });
  });

  socket.on("receiveMessage", (msg) => {
    const messagesDiv = document.getElementById("messages");
    const div = document.createElement("div");
    div.textContent = `${msg.from}: ${msg.text}`;
    messagesDiv.appendChild(div);
  });
}

function sendMessage() {
  const text = document.getElementById("messageInput").value;
  socket.emit("sendMessage", { from: currentUser.prenom, text });
  document.getElementById("messageInput").value = "";
}
