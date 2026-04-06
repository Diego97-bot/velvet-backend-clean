let detalleActual = null;

/* ============================
   PERFIL
============================ */

function mostrarFormularioPerfil() {
    document.getElementById("perfil-vista").classList.add("hidden");
    document.getElementById("perfil-form").classList.remove("hidden");
}

function cancelarEdicionPerfil() {
    document.getElementById("perfil-form").classList.add("hidden");
    document.getElementById("perfil-vista").classList.remove("hidden");
}

async function cargarPerfil() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("No hay token, usuario no logueado");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/auth/mi-perfil", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (data.error) {
            console.error("Error al cargar perfil:", data.error);
            return;
        }

        // 🔥 Guardar usuario para Stripe
        localStorage.setItem("usuario", JSON.stringify(data));

        // Pintar datos en la vista
        document.getElementById("perfil-nombre-text").textContent = data.nombre;
        document.getElementById("perfil-email-text").textContent = data.email;

        // Pintar datos en el formulario
        document.getElementById("perfil-nombre").value = data.nombre;
        document.getElementById("perfil-email").value = data.email;

    } catch (err) {
        console.error("Error al obtener perfil:", err);
    }
}

/* ============================
   EXTRAS DEL USUARIO
============================ */

async function cargarExtrasUsuario() {
    try {
        const res = await fetch("http://localhost:3000/auth/mi-perfil/count", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        });

        const data = await res.json();

        document.getElementById("extras-count").textContent = data.extras;
        const extrasNum = Number(data.extras);

        document.getElementById("btn-comprar-extra").disabled = extrasNum >= 3;
    } catch (err) {
        console.error("Error cargando extras:", err);
    }
}

/* ============================
   GUARDAR PERFIL
============================ */

async function guardarPerfil(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const nombre = document.getElementById("perfil-nombre").value.trim();
    const email = document.getElementById("perfil-email").value.trim();

    const actual = document.getElementById("password-actual").value.trim();
    const nueva = document.getElementById("password-nueva").value.trim();
    const nueva2 = document.getElementById("password-nueva2").value.trim();

    const mensaje = document.getElementById("perfil-mensaje");

    try {
        const res = await fetch("http://localhost:3000/mi-perfil", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ nombre, email })
        });

        const data = await res.json();

        if (data.error) {
            mensaje.textContent = data.error;
            mensaje.style.color = "#ff6b6b";
            return;
        }

        if (actual || nueva || nueva2) {
            const ok = await cambiarPassword();
            if (!ok) return;
        }

        mensaje.textContent = "Datos actualizados correctamente.";
        mensaje.style.color = "#8be98b";

        document.getElementById("perfil-nombre-text").textContent = nombre;
        document.getElementById("perfil-email-text").textContent = email;

        cancelarEdicionPerfil();

    } catch (err) {
        mensaje.textContent = "Error al actualizar perfil.";
        mensaje.style.color = "#ff6b6b";
    }
}

async function cambiarPassword() {
    const token = localStorage.getItem("token");

    const actual = document.getElementById("password-actual").value;
    const nueva = document.getElementById("password-nueva").value;
    const nueva2 = document.getElementById("password-nueva2").value;

    const mensaje = document.getElementById("perfil-mensaje");

    if (nueva !== nueva2) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        mensaje.style.color = "#ff6b6b";
        return false;
    }

    const res = await fetch("http://localhost:3000/mi-perfil/password", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            password_actual: actual,
            password_nueva: nueva
        })
    });

    const data = await res.json();

    if (data.error) {
        mensaje.textContent = data.error;
        mensaje.style.color = "#ff6b6b";
        return false;
    }

    mensaje.textContent = "Contraseña actualizada correctamente.";
    mensaje.style.color = "#8be98b";

    document.getElementById("password-actual").value = "";
    document.getElementById("password-nueva").value = "";
    document.getElementById("password-nueva2").value = "";

    return true;
}

/* ============================
   MIS ANUNCIOS
============================ */

async function cargarMisAnuncios() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Debes iniciar sesión para ver tus anuncios");
        return;
    }

    const resAnuncios = await fetch("http://localhost:3000/posts", {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const anunciosJson = await resAnuncios.json();
    const anunciosData = Array.isArray(anunciosJson) ? anunciosJson : (anunciosJson.anuncios || []);

    const resHabitaciones = await fetch("http://localhost:3000/habitaciones", {
        headers: { "Authorization": `Bearer ${token}` }
    });
    const habitacionesJson = await resHabitaciones.json();
    const habitacionesData = Array.isArray(habitacionesJson) ? habitacionesJson : (habitacionesJson.habitaciones || []);

    const misPublicaciones = [
        ...anunciosData.map(a => ({ ...a, tipo_post: "anuncio" })),
        ...habitacionesData.map(h => ({ ...h, tipo_post: "habitacion" }))
    ];

    const contenedor = document.getElementById("lista-anuncios");
    contenedor.innerHTML = "";

    misPublicaciones.forEach(a => {
        const div = document.createElement("div");
        div.classList.add("anuncio-item");

        div.innerHTML = `
            <div class="img-wrapper">
                <img src="${a.portada_url || 'img/sin-foto.jpg'}">
                <div class="badges-img">
                    ${a.plan.id !== 1 ? `
                        ${a.plan.nombre === "premium" ? `<span class="badge-img badge-plan premium">⭐</span>` : ""}
                        ${a.plan.nombre === "vip" ? `<span class="badge-img badge-plan vip">💎</span>` : ""}
                    ` : ""}
                    ${a.verificado ? `<span class="badge-img badge-verificado">✔</span>` : ""}
                </div>
            </div>

            <div class="anuncio-info">
                <h3>${a.titulo}</h3>
                <p>👁️ Visitas: <strong>${a.visitas_total || 0}</strong></p>

                ${a.plan.id !== 1 ? `
                    <p class="expira">⏳ Expira: ${new Date(a.plan.expira).toLocaleDateString()}</p>
                ` : ""}

                ${a.extras.length > 0 ? `
                    <div class="extras">
                        ${a.extras.map(e => {
            let label = "";
            if (e.nombre === "subida_24h") label = "🔝 Subida 24h";
            if (e.nombre === "boost_3dias") {
                const expira = new Date(e.expira);
                const expiraStr = expira.toLocaleDateString("es-ES");
                label = `⚡ Boost 3 días - ${expiraStr}`;
            }
            if (e.nombre === "auto_subida_6h") {
                const expira = new Date(e.expira);
                const expiraStr = expira.toLocaleDateString("es-ES");
                label = `🔄 Auto‑subida cada 6h - ${expiraStr}`;
            }
            return label ? `<span class="extra">${label}</span>` : "";
        }).join("")}
                    </div>
                ` : ""}
            </div>

            <div class="anuncio-actions">
                <button class="btn-editar">✏️ Editar</button>
                <button class="btn-eliminar">🗑️ Eliminar</button>
                <button class="btn-mejorar">🔝 Mejorar</button>
            </div>
        `;

        div.querySelector(".btn-editar").addEventListener("click", () => {
            editarAnuncio(a.id, a.tipo_post);
        });

        div.querySelector(".btn-eliminar").addEventListener("click", () => {
            eliminarAnuncio(a.id, a.tipo_post);
        });

        div.querySelector(".btn-mejorar").addEventListener("click", () => {
            mejorar(a.id, a.tipo_post);
        });

        contenedor.appendChild(div);
    });
}

async function eliminarAnuncio(id, tipo) {
    if (!confirm("¿Seguro que quieres eliminar este anuncio?")) return;

    const token = localStorage.getItem("token");
    const API = "http://localhost:3000";

    let url = tipo === "habitacion"
        ? `${API}/habitaciones/${id}`
        : `${API}/posts/${id}`;

    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (res.ok) {
        alert("Eliminado correctamente");
        cargarMisAnuncios();
    } else {
        alert("Error al eliminar");
    }
}

function editarAnuncio(id, tipo) {
    window.location.href = tipo === "habitacion"
        ? `editar-habitacion.html?id=${id}`
        : `editar-normal.html?id=${id}`;
}

function mejorar(id, tipo) {
    window.location.href = `mejorar.html?id=${id}&tipo=${tipo}`;
}

/* ============================
   COMPRAR ANUNCIOS EXTRA (STRIPE)
============================ */

document.getElementById("btn-comprar-extra").addEventListener("click", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || !usuario.id) {
        alert("Error: no se pudo cargar el usuario.");
        return;
    }

    const payload = {
        tipo: "extra",
        usuario_id: usuario.id,
        extras: [
            {
                nombre: "anuncios_extra",
                cantidad: 1
            }
        ]
    };

    const res = await fetch("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.url) {
        window.location.href = data.url;
    } else {
        console.error(data);
        alert("Error al iniciar el pago");
    }
});

let paginaActual = 1;
const limite = 10;

async function cargarHistorialPagos(page = 1) {
    const usuario_id = localStorage.getItem("usuario_id");

    const res = await fetch(`http://localhost:3000/api/pagos/${usuario_id}?page=${page}&limit=${limite}`);
    const json = await res.json();

    const pagos = json.data;
    paginaActual = json.page;

    const cont = document.getElementById("historial-pagos");
    cont.innerHTML = "";

    pagos.forEach(p => {
        const plan = p.plan ? p.plan.nombre : null;

        const extras = (p.extras || [])
            .map(e => `<span class="extra-tag">${e.nombre}</span>`)
            .join("");

        cont.innerHTML += `
        <tr>
            <td>${plan ? `<span class="plan-tag">${plan}</span>` : "Compra de extras"}</td>
            <td>${extras}</td>
            <td>${p.cantidad}€</td>
            <td>${new Date(p.fecha).toLocaleString()}</td>
            <td>${p.referencia}</td>
        </tr>`;
    });

    renderPaginacion(json.total_pages);
}

function renderPaginacion(totalPaginas) {
    const pag = document.getElementById("paginacion");
    pag.innerHTML = "";

    for (let i = 1; i <= totalPaginas; i++) {
        pag.innerHTML += `
            <button class="btn-pag ${i === paginaActual ? "activo" : ""}" onclick="cargarHistorialPagos(${i})">
                ${i}
            </button>
        `;
    }
}





/* ============================
   INICIO
============================ */

document.addEventListener("DOMContentLoaded", () => {
    cargarExtrasUsuario();
    cargarPerfil();
    cargarMisAnuncios();
    cargarHistorialPagos()
});
