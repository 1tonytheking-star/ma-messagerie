document.getElementById("loginBtn").addEventListener("click", () => {
  const prenom = document.getElementById("prenom").value.trim();
  const nom = document.getElementById("nom").value.trim();
  const code = document.getElementById("code").value.trim();

  if (!prenom || !nom || !code) {
    alert("Merci de remplir tous les champs !");
    return;
  }

  const user = { prenom, nom, code };
  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "index.html";
});
