const socket = io();
const user = JSON.parse(localStorage.getItem("user"));
let selectedUser = null;

if (!user) {
  window.location.href = "login.html";
}

socket.emit("login", user);

const usersList = document.getElementById("users");
const messagesDiv = document.getElementById("messages");
const form = document.getElementById("messageForm");
const input = document.getElementById("messageInput");

socket.on("userList", (users) => {
  usersList.innerHTML = "";
  users.forEach((u) => {
    if (u.code !== user.code) {
      const li = document.createElement("li");
      li.textContent = `${u.name} ${u.surname}`;
      li.onclick = () => selectUser(u);
      usersList.appendChild(li);
    }
  });
});

function selectUser(u) {
  selectedUser = u;
  messagesDiv.innerHTML = `<h4>Conversation avec ${u.name}</h4>`;
  socket.emit("getConversation", { from: user, to: u });
}

socket.on("conversationData", (data) => {
  data.forEach((m) => {
    const p = document.createElement("p");
    p.textContent = `${m.from.name}: ${m.message}`;
    messagesDiv.appendChild(p);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (selectedUser && input.value.trim()) {
    socket.emit("privateMessage", {
      from: user,
      to: selectedUser,
      message: input.value
    });
    input.value = "";
  }
});

socket.on("privateMessage", ({ from, to, message }) => {
  if (
    (selectedUser && (selectedUser.code === from.code || selectedUser.code === to.code)) ||
    from.code === user.code
  ) {
    const p = document.createElement("p");
    p.textContent = `${from.name}: ${message}`;
    messagesDiv.appendChild(p);
  }
});
