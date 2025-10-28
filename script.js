const socket = io(); // Connexion au serveur

const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageText = input.value.trim();
    if (messageText === '') return;

    // Envoie le message au serveur
    socket.emit('chat message', messageText);

    input.value = '';
    input.focus();
});

// Quand un message est reçu du serveur
socket.on('chat message', (msg) => {
    const li = document.createElement('li');
    li.textContent = msg;
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight; // Scroll automatique
});
