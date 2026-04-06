// ============================
// PARAMS
// ============================
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const tipo = params.get("tipo");

// ============================
// SAFE PARSE
// ============================
function safeParse(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
        return [value];
    }
}

// ============================
// VER DETALLE
// ============================
async function verDetalle(id, tipo) {
    try {
        const token = localStorage.getItem("token");

        const url = tipo === "anuncio"
            ? `http://localhost:3000/posts/${id}`
            : `http://localhost:3000/habitaciones/${id}`;

        const res = await fetch(url, {
            headers: { "Authorization": "Bearer " + token }
        });

        const json = await res.json();
        console.log("DETALLE:", json);

        if (!json.ok) return console.error(json.error);

        const data = json.anuncio || json.habitacion;

        if (!data.portada_url) data.portada_url = "img/sin-foto.jpg";
        if (!Array.isArray(data.galeria)) data.galeria = [];

        localStorage.setItem("scrollPos", window.scrollY);
        localStorage.setItem("filtros", window.location.search);

        mostrarDetalle(data);

    } catch (err) {
        console.error("ERROR DETALLE:", err);
    }
}

// ============================
// PINTAR DETALLE
// ============================
function mostrarDetalle(data) {

    fotosVisor = [
        data.portada_url,
        ...data.galeria.map(f => f.url)
    ];

    // ============================
    // VIDEO
    // ============================
    let bloqueVideo = "";
    if (data.video_url) {
        bloqueVideo = `
            <h2>🎥 Video</h2>
            <video controls class="detalle-video">
                <source src="${data.video_url}">
            </video>
        `;
    }

    // ============================
    // AUDIO
    // ============================
    let bloqueAudio = "";
    if (data.audio_url) {
        bloqueAudio = `
            <h2>🎧 Audio</h2>
            <audio controls class="detalle-audio">
                <source src="${data.audio_url}">
            </audio>
        `;
    }

    // ============================
    // HABITACIÓN
    // ============================
    if (data.tipo_post === "habitacion") {

        const servicios = safeParse(data.servicios);
        const normas = safeParse(data.normas);
        const tipoHabitacion = safeParse(data.tipo_habitacion);

        const html = `
            <h1>🏠 ${data.titulo}</h1>

            <img src="${data.portada_url}" class="popup-foto-principal" onclick="abrirLightbox(0)">

            <p class="info-line">📍 <strong>${data.provincia}</strong> · ${data.ciudad}</p>

            <p class="info-line">🛏️ Habitaciones: <strong>${data.numero_habitaciones || "—"}</strong></p>

            <p class="info-line">🏷️ Tipo: <strong>${tipoHabitacion.join(", ")}</strong></p>

            <p class="info-line price">💸 <strong>${data.precio_semana} €/semana</strong></p>

            <h2>📝 Descripción</h2>
            <p class="descripcion">${data.descripcion}</p>

            ${bloqueVideo}
            ${bloqueAudio}

            <h2>✨ Servicios incluidos</h2>
            <div class="servicios-columnas">
                ${
                    servicios.length > 0
                    ? servicios.map(s => `<div class="servicio-item">${s}</div>`).join("")
                    : "<div class='servicio-item'>No especificados</div>"
                }
            </div>

            <h2>📌 Normas</h2>
            <div class="servicios-columnas">
                ${
                    normas.length > 0
                    ? normas.map(n => `<div class="servicio-item">${n}</div>`).join("")
                    : "<div class='servicio-item'>No especificadas</div>"
                }
            </div>

            <h2>📸 Galería</h2>
            <div class="popup-galeria">
                ${fotosVisor.map((f, i) => `<img src="${f}" onclick="abrirLightbox(${i})">`).join("")}
            </div>

            <div class="popup-actions-row">
                <a class="popup-btn-row btn-llamar" href="tel:${data.telefono}">📞 Llamar</a>
                <a class="popup-btn-row btn-whatsapp" href="https://wa.me/${data.telefono}">💬 WhatsApp</a>     
            </div>
        `;

        document.getElementById("popup-content").innerHTML = html;
        document.getElementById("popup-detalle").classList.remove("hidden");
        return;
    }

    // ============================
    // ANUNCIO NORMAL
    // ============================
    const servicios = safeParse(data.servicios);

    const html = `
        <h1>💗 ${data.titulo}</h1>

        <img src="${data.portada_url}" class="popup-foto-principal" onclick="abrirLightbox(0)">

        <p class="info-line">📍 <strong>${data.provincia}</strong> · ${data.ciudad}</p>
        <p class="info-line">🌍 ${data.nacionalidad} · ${data.edad} años</p>
        <p class="info-line price">💸 <strong>${data.precio} €</strong></p>

        <h2>📝 Descripción</h2>
        <p class="descripcion">${data.descripcion}</p>

        ${bloqueVideo}
        ${bloqueAudio}

        <h2>✨ Servicios</h2>
        <div class="servicios-columnas">
            ${
                servicios.length > 0
                ? servicios.map(s => `<div class="servicio-item">${s}</div>`).join("")
                : "<div class='servicio-item'>No especificados</div>"
            }
        </div>

        <h2>📸 Galería</h2>
        <div class="popup-galeria">
            ${fotosVisor.map((f, i) => `<img src="${f}" onclick="abrirLightbox(${i})">`).join("")}
        </div>

        <div class="popup-actions-row">
            <a class="popup-btn-row btn-llamar" href="tel:${data.telefono}">📞 Llamar</a>
            <a class="popup-btn-row btn-whatsapp" href="https://wa.me/${data.telefono}">💬 WhatsApp</a>     
        </div>
    `;

    document.getElementById("popup-content").innerHTML = html;
    document.getElementById("popup-detalle").classList.remove("hidden");
}

// ============================
// POPUP
// ============================
function cerrarPopup() {
    const filtros = localStorage.getItem("filtros") || "";
    const scrollPos = localStorage.getItem("scrollPos") || 0;

    const pagina = document.referrer.includes("index")
        ? "index.html"
        : window.location.pathname;

    window.location.href = pagina + filtros;

    setTimeout(() => {
        window.scrollTo(0, scrollPos);
    }, 80);
}

// ============================
// LIGHTBOX
// ============================
let fotosVisor = [];
let fotoActual = 0;

function abrirLightbox(index) {
    fotoActual = index;
    document.getElementById("lightbox-img").src = fotosVisor[index];
    document.getElementById("lightbox").classList.remove("hidden");
}

function cerrarLightbox() {
    document.getElementById("lightbox").classList.add("hidden");
}

function fotoAnterior() {
    fotoActual = (fotoActual - 1 + fotosVisor.length) % fotosVisor.length;
    document.getElementById("lightbox-img").src = fotosVisor[fotoActual];
}

function fotoSiguiente() {
    fotoActual = (fotoActual + 1) % fotosVisor.length;
    document.getElementById("lightbox-img").src = fotosVisor[fotoActual];
}

// ============================
// EJECUTAR
// ============================
verDetalle(id, tipo);
