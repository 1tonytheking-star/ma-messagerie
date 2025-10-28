const socket = io();

document.getElementById("login-btn").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const code = document.getElementById("code").value.trim();

  if (name && surname && code) {
    localStorage.setItem("user", JSON.stringify({ name, surname, code }));
    socket.emit("login", { name, surname, code });
    window.location.href = "chat.html";
  } else {
    alert("Remplis tous les champs !");
  }
});
