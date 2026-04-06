

// ===============================
// REGISTRO
// ===============================
async function registrarUsuario(e) {
    e.preventDefault(); // Evita que el formulario se envíe automáticamente

    const nombre = document.getElementById("reg-nombre").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-pass").value;
    const password2 = document.getElementById("reg-pass2").value;
    const check = document.getElementById("mayor18");

    // Validación de contraseñas
    if (password !== password2) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // Validación del checkbox +18
    if (!check.checked) {
        alert("Debes confirmar que eres mayor de 18 años para registrarte.");
        return;
    }

    // Enviar datos al backend
    const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Registro exitoso");
        window.location.href = "login.html";
    } else {
        alert(data.error);
    }
}



// ===============================
// LOGIN
// ===============================
async function loginUsuario() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-pass").value;

    const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario_id", data.user.id); // ← CLAVE
        alert("Bienvenido " + data.user.nombre);
        window.location.href = "index.html";
    } else {
        alert(data.error);
    }
}


// ===============================
// LOGOUT
// ===============================
function logout() {
    localStorage.removeItem("token");
    window.location.reload();
}

// ===============================
// MOSTRAR / OCULTAR BOTONES
// ===============================
function actualizarBotones() {
    const token = localStorage.getItem("token");

    const botonesGuest = document.querySelectorAll(".btn-login, .btn-register");
    const botonesAuth = document.querySelectorAll(".btn-publish, .btn-cuenta, .btn-logout");

    if (token) {
        botonesGuest.forEach(b => b.style.display = "none");
        botonesAuth.forEach(b => b.style.display = "inline-block");
    } else {
        botonesGuest.forEach(b => b.style.display = "inline-block");
        botonesAuth.forEach(b => b.style.display = "none");
    }
}

document.addEventListener("DOMContentLoaded", actualizarBotones);
