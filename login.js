function login() {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();
  const msg  = document.getElementById("msg");

  const users = [
    { user: "admin", pass: "1234" },
    { user: "sabine", pass: "apeiros" },
    { user: "orito", pass: "orito" },
    { user: "visitante", pass: "12345"}
  ];

  const found = users.find(
    u => u.user === user && u.pass === pass
  );

  if (found) {
    localStorage.setItem("login", "true");
    localStorage.setItem("currentUser", found.user);
    location.href = "index-login.html";
  } else {
    msg.innerText = "Usuario o contraseña incorrectos";
  }
}