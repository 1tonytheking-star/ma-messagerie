const socket = io();
const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "login.html";

socket.emit("newUser", user);

const userListDiv = document.getElementById("userList");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let selectedUser = null;

socket.on("userList", (users) => {
  userListDiv.innerHTML = "";
  users.forEach(u => {
    const div = document.createElement("div");
    div.textContent = `${u.prenom} ${u.nom}` + (u.online ? " 🟢" : " 🔴");
    div.addEventListener("click", () => {
      selectedUser = u;
      messagesDiv.innerHTML = `<p>Chat avec ${u.prenom} ${u.nom}</p>`;
    });
    userListDiv.appendChild(div);
  });
});

socket.on("message", (data) => {
  if (!selectedUser || data.from !== selectedUser.code) return;
  const p = document.createElement("p");
  p.textContent = `${data.sender}: ${data.message}`;
  messagesDiv.appendChild(p);
});

sendBtn.addEventListener("click", () => {
  const msg = messageInput.value.trim();
  if (msg && selectedUser) {
    socket.emit("privateMessage", {
      from: user.code,
      to: selectedUser.code,
      sender: `${user.prenom} ${user.nom}`,
      message: msg
    });
    messageInput.value = "";
  }
});
