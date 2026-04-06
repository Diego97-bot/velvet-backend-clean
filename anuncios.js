// ============================
// CATEGORÍAS
// ============================
const categorias = [
    "Escort",
    "Masaje",
    "BDSM",
    "VIPS",
    "Gays",
    "Travestis",
    "Parejas",
    "Videollamadas",
    "Trabajo",
    "Habitacion",
];

// ============================
// PROVINCIAS (CORREGIDAS)
// ============================
const provincias = [
    "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila",
    "Badajoz", "Barcelona", "Burgos",
    "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ceuta", "Ciudad Real", "Córdoba", "Cuenca",
    "Girona", // FIX
    "Granada", "Guadalajara", "Guipúzcoa",
    "Huelva", "Huesca",
    "Illes Balears", // FIX
    "Jaén",
    "La Coruña", "La Rioja", "Las Palmas", "León",
    "Lleida", // FIX
    "Lugo",
    "Madrid", "Málaga", "Melilla", "Murcia",
    "Navarra",
    "Ourense", // FIX
    "Palencia", "Pontevedra",
    "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria",
    "Tarragona", "Teruel", "Toledo",
    "Valencia", "Valladolid", "Vizcaya",
    "Zamora", "Zaragoza"
];

// ============================
// CIUDADES (NO TOCADO)
// ============================
const ciudades = {
    "Álava": ["Amurrio", "Llodio", "Vitoria-Gasteiz"],
    "Albacete": ["Albacete", "Hellín", "Villarrobledo"],
    "Alicante": ["Alicante", "Benidorm", "Denia", "Elche", "Elda", "Orihuela", "Torrevieja"],
    "Almería": ["Almería", "El Ejido", "Níjar", "Roquetas de Mar"],
    "Asturias": ["Avilés", "Gijón", "Mieres", "Oviedo"],
    "Ávila": ["Arévalo", "Arenas de San Pedro", "Ávila"],
    "Badajoz": ["Almendralejo", "Badajoz", "Don Benito", "Mérida", "Villanueva de la Serena", "Zafra"],
    "Barcelona": ["Badalona", "Barcelona", "Granollers", "Hospitalet", "Mataró", "Sabadell", "Terrassa"],
    "Burgos": ["Aranda de Duero", "Briviesca", "Burgos", "Miranda de Ebro"],
    "Cáceres": ["Cáceres", "Coria", "Miajadas", "Navalmoral de la Mata", "Plasencia", "Trujillo"],
    "Cádiz": ["Algeciras", "Cádiz", "Chiclana", "El Puerto de Santa María", "Jerez de la Frontera", "San Fernando"],
    "Cantabria": ["Castro Urdiales", "Santander", "Torrelavega"],
    "Castellón": ["Benicarló", "Castellón de la Plana", "Onda", "Vila-real"],
    "Ceuta": ["Ceuta"],
    "Ciudad Real": ["Ciudad Real", "Puertollano", "Tomelloso", "Valdepeñas"],
    "Córdoba": ["Córdoba", "Lucena", "Montilla", "Puente Genil"],
    "Cuenca": ["Cuenca", "San Clemente", "Tarancón"],
    "Girona": ["Blanes", "Figueres", "Girona", "Olot"],
    "Granada": ["Almuñécar", "Armilla", "Granada", "Motril"],
    "Guadalajara": ["Alovera", "Azuqueca de Henares", "Guadalajara"],
    "Guipúzcoa": ["Eibar", "Irún", "Rentería", "San Sebastián"],
    "Huelva": ["Almonte", "Huelva", "Isla Cristina", "Lepe"],
    "Huesca": ["Barbastro", "Huesca", "Jaca", "Monzón"],
    "Illes Balears": ["Ibiza", "Mahón", "Manacor", "Palma de Mallorca"],
    "Jaén": ["Andújar", "Jaén", "Linares", "Úbeda"],
    "La Coruña": ["A Coruña", "Ferrol", "Narón", "Santiago de Compostela"],
    "La Rioja": ["Calahorra", "Haro", "Logroño"],
    "Las Palmas": ["Arrecife", "Las Palmas de Gran Canaria", "San Bartolomé de Tirajana", "Telde"],
    "León": ["León", "Ponferrada", "San Andrés del Rabanedo", "Villablino"],
    "Lleida": ["Balaguer", "Lleida", "Tàrrega"],
    "Lugo": ["Lugo", "Monforte de Lemos", "Viveiro"],
    "Madrid": ["Alcalá de Henares", "Alcorcón", "Fuenlabrada", "Getafe", "Leganés", "Madrid", "Móstoles", "Parla", "Torrejón de Ardoz"],
    "Málaga": ["Benalmádena", "Estepona", "Fuengirola", "Málaga", "Marbella", "Torremolinos", "Vélez-Málaga"],
    "Melilla": ["Melilla"],
    "Murcia": ["Águilas", "Cartagena", "Lorca", "Molina de Segura", "Murcia", "Yecla"],
    "Navarra": ["Burlada", "Pamplona", "Tudela"],
    "Ourense": ["O Barco de Valdeorras", "Ourense", "Verín"],
    "Palencia": ["Aguilar de Campoo", "Guardo", "Palencia"],
    "Pontevedra": ["Pontevedra", "Redondela", "Vilagarcía de Arousa", "Vigo"],
    "Salamanca": ["Béjar", "Ciudad Rodrigo", "Salamanca"],
    "Santa Cruz de Tenerife": ["Adeje", "Arona", "La Laguna", "Santa Cruz de Tenerife"],
    "Segovia": ["Cuéllar", "El Espinar", "Segovia"],
    "Sevilla": ["Alcalá de Guadaíra", "Dos Hermanas", "Mairena del Aljarafe", "Sevilla", "Utrera"],
    "Soria": ["Almazán", "Soria", "Ólvega"],
    "Tarragona": ["Cambrils", "Reus", "Salou", "Tarragona"],
    "Teruel": ["Alcañiz", "Andorra", "Teruel"],
    "Toledo": ["Illescas", "Seseña", "Talavera de la Reina", "Toledo"],
    "Valencia": ["Gandía", "Ontinyent", "Paterna", "Requena", "Sagunto", "Torrent", "Valencia"],
    "Valladolid": ["Laguna de Duero", "Medina del Campo", "Valladolid"],
    "Vizcaya": ["Barakaldo", "Bilbao", "Getxo", "Portugalete"],
    "Zamora": ["Benavente", "Toro", "Zamora"],
    "Zaragoza": ["Calatayud", "Ejea de los Caballeros", "Utebo", "Zaragoza"]
};

document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookie-banner");

    // Si ya eligió, no mostrar banner
    if (localStorage.getItem("velvet_cookies")) {
        banner.style.display = "none";
        return;
    }

    // Aceptar cookies
    document.getElementById("cookie-accept").addEventListener("click", () => {
        localStorage.setItem("velvet_cookies", "accepted");
        banner.style.display = "none";
    });

    // Rechazar cookies
    document.getElementById("cookie-reject").addEventListener("click", () => {
        localStorage.setItem("velvet_cookies", "rejected");
        banner.style.display = "none";
    });
});


// ============================
// VARIABLES GLOBALES
// ============================
let anuncios = [];
let fotosLightbox = [];
let fotoActual = 0;
let dataDetalle = null; // ← NECESARIO PARA DETECTAR VIDEO/AUDIO EN LIGHTBOX


// ============================
// RELLENAR FILTROS
// ============================
function rellenarFiltros() {

    const selCat = document.getElementById("filtro-categoria");
    const selProv = document.getElementById("filtro-provincia");
    const selCiudad = document.getElementById("filtro-ciudad");

    selCat.innerHTML = `<option value="">Categoría</option>`;
    selProv.innerHTML = `<option value="">Provincia</option>`;
    selCiudad.innerHTML = `<option value="">Ciudad</option>`;

    categorias.forEach(c => {
        selCat.innerHTML += `<option value="${c}">${c}</option>`;
    });

    provincias.forEach(p => {
        selProv.innerHTML += `<option value="${p}">${p}</option>`;
    });

    selProv.addEventListener("change", () => {
        const prov = selProv.value;

        selCiudad.innerHTML = `<option value="">Ciudad</option>`;

        if (ciudades[prov]) {
            ciudades[prov].forEach(c => {
                selCiudad.innerHTML += `<option value="${c}">${c}</option>`;
            });
        }

        cargarAnuncios();
    });
}


// ============================
// CARDS
// ============================
function cardAnuncio(a) {
    const descCorta = a.descripcion
        ? (a.descripcion.length > 120 ? a.descripcion.substring(0, 120) + "…" : a.descripcion)
        : "";

    let badgePlan = "";
    let planClass = "";

    if (a.plan?.nombre === "premium") {
        planClass = "card-premium";
        badgePlan = `<span class="badge badge-premium"><span>⭐</span></span>`;
    }

    if (a.plan?.nombre === "vip") {
        planClass = "card-vip";
        badgePlan = `<span class="badge badge-vip"><span>💎</span></span>`;
    }

    let badgeVerificado = "";
    if (a.verificado) {
        badgeVerificado = `<span class="badge badge-verificado">✔</span>`;
    }

    return `
<article class="card ${planClass}" onclick="verDetalle(${a.id}, 'anuncio')">
    <div class="badge-container">
        ${badgePlan}
        ${badgeVerificado}
    </div>

    <img src="${a.portada_url || 'img/sin-foto.jpg'}">

    <div class="card-body">
        <h3>${a.titulo}</h3>
        <p>📍 ${a.provincia} · ${a.ciudad}</p>
        <p class="desc">${descCorta}</p>
        <p>🌍 ${a.nacionalidad} · ${a.edad} años</p>
        <p class="price">💸 ${a.precio} €</p>
    </div>
</article>
`;
}

function cardHabitacion(h) {
    const descCorta = h.descripcion
        ? (h.descripcion.length > 120 ? h.descripcion.substring(0, 120) + "…" : h.descripcion)
        : "";

    let badgePlan = "";
    let planClass = "";

    if (h.plan?.nombre === "premium") {
        planClass = "card-premium";
        badgePlan = `<span class="badge badge-premium"><span>⭐</span></span>`;
    }

    if (h.plan?.nombre === "vip") {
        planClass = "card-vip";
        badgePlan = `<span class="badge badge-vip"><span>💎</span></span>`;
    }

    let badgeVerificado = "";
    if (h.verificado) {
        badgeVerificado = `<span class="badge badge-verificado">✔</span>`;
    }

    return `
<article class="card card-habitacion ${planClass}" onclick="verDetalle(${h.id}, 'habitacion')">
    <div class="badge-container">
        ${badgePlan}
        ${badgeVerificado}
    </div>

    <img src="${h.portada_url || 'img/sin-foto.jpg'}">

    <div class="card-body">
        <h3>${h.titulo}</h3>
        <p>📍 ${h.provincia} · ${h.ciudad}</p>
        <p class="desc">${descCorta}</p>
        <p>🛏️ ${h.numero_habitaciones} habitaciones</p>
        <p class="price">💸 ${h.precio_semana} €/semana</p>
    </div>
</article>
`;
}


// ============================
// FILTRADO
// ============================
const limpiarTexto = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function cargarAnuncios() {

    const filtros = {
        categoria: document.getElementById("filtro-categoria").value,
        provincia: document.getElementById("filtro-provincia").value,
        ciudad: document.getElementById("filtro-ciudad").value,
        texto: document.getElementById("filtro-texto").value
    };

    if (!window._inicializandoFiltros) {
        localStorage.setItem("filtros", JSON.stringify(filtros));
    }

    const cont = document.getElementById("cards-container");
    cont.innerHTML = "";

    const fCategoria = normalizarCategoria(filtros.categoria);
    const fProvincia = filtros.provincia;
    const fCiudad = filtros.ciudad;
    const fTexto = limpiarTexto(filtros.texto);

    const filtrados = anuncios.filter(a => {
        const serviciosTexto = Array.isArray(a.servicios) ? a.servicios.join(' ') : (a.servicios || "");
        const contenidoBusqueda = limpiarTexto(`
            ${a.titulo} 
            ${a.descripcion} 
            ${a.provincia} 
            ${a.ciudad} 
            ${serviciosTexto}
        `);

        return (
            (fCategoria === "" || a.categoria === fCategoria) &&
            (fProvincia === "" || a.provincia === fProvincia) &&
            (fCiudad === "" || a.ciudad === fCiudad) &&
            (fTexto === "" || contenidoBusqueda.includes(fTexto))
        );
    });

    filtrados.forEach(a => {
        const cardHtml = a.tipo_post === "anuncio" ? cardAnuncio(a) : cardHabitacion(a);
        cont.insertAdjacentHTML('beforeend', cardHtml);
    });
}


// ============================
// NORMALIZAR
// ============================
function normalizarCategoria(c) {
    return (c || "")
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


// ============================
// OVERLAY DETALLE
// ============================
function verDetalle(id, tipo) {

    const url = tipo === "anuncio"
        ? `http://localhost:3000/posts/public/${id}`
        : `http://localhost:3000/habitaciones/public/${id}`;

    fetch(url)
        .then(r => r.json())
        .then(data => {

            const item = data.anuncio || data.habitacion;

            if (data.anuncio) item.tipo_post = "anuncio";
            if (data.habitacion) item.tipo_post = "habitacion";

            mostrarDetalle(item);

            document.getElementById("popup-detalle").classList.remove("hidden");
            document.body.style.overflow = "hidden";
        });
}

function cerrarDetalle() {
    document.getElementById("popup-detalle").classList.add("hidden");
    document.body.style.overflow = "auto";

    const scrollPos = localStorage.getItem("scrollPos");
    if (scrollPos) {
        window.scrollTo(0, parseInt(scrollPos));
    }
}


// ============================
// LIGHTBOX — FOTO / VIDEO / AUDIO
// ============================
function mostrarLightboxElemento() {
    const url = fotosLightbox[fotoActual];

    const img = document.getElementById("lightbox-img");
    const video = document.getElementById("lightbox-video");
    const audio = document.getElementById("lightbox-audio");
    const audioWrap = document.getElementById("lightbox-audio-wrapper");

    // Ocultar todo
    img.style.display = "none";
    video.style.display = "none";
    audioWrap.style.display = "none";

    const esVideo = dataDetalle?.video_url && url === dataDetalle.video_url;
    const esAudio = dataDetalle?.audio_url && url === dataDetalle.audio_url;

    if (esVideo) {
        video.src = url;
        video.style.display = "block";
        return;
    }

    if (esAudio) {
        audio.src = url;
        audioWrap.style.display = "block";
        return;
    }

    img.src = url;
    img.style.display = "block";
}


function abrirLightbox(index) {
    fotoActual = index;
    mostrarLightboxElemento();
    document.getElementById("lightbox").classList.remove("hidden");
}

function cerrarLightbox() {
    document.getElementById("lightbox").classList.add("hidden");
}

function lightboxAnterior() {
    fotoActual = (fotoActual - 1 + fotosLightbox.length) % fotosLightbox.length;
    mostrarLightboxElemento();
}

function lightboxSiguiente() {
    fotoActual = (fotoActual + 1) % fotosLightbox.length;
    mostrarLightboxElemento();
}

// ============================
// MOSTRAR DETALLE
// ============================
function mostrarDetalle(data) {

    // Guardamos el detalle globalmente para el lightbox
    dataDetalle = data;

    // ============================
    // PREPARAR DATOS
    // ============================

    // Servicios
    let servicios = [];
    if (typeof data.servicios === "string") {
        try { servicios = JSON.parse(data.servicios); } catch { }
    } else if (Array.isArray(data.servicios)) {
        servicios = data.servicios;
    }

    // Normas
    let normas = [];
    if (typeof data.normas === "string") {
        normas = data.normas.split("\n").filter(n => n.trim() !== "");
    }

    // Tipo habitación
    let tipoHabitacion = [];
    if (typeof data.tipo_habitacion === "string") {
        try { tipoHabitacion = JSON.parse(data.tipo_habitacion); } catch { }
    } else if (Array.isArray(data.tipo_habitacion)) {
        tipoHabitacion = data.tipo_habitacion;
    }

    // ============================
    // GALERÍA + VIDEO + AUDIO
    // ============================
    const fotosVisor = [
        data.portada_url,
        ...(data.galeria?.map(g => g.url).filter(url => url !== data.portada_url) || []),
        ...(data.video_url ? [data.video_url] : []),
        ...(data.audio_url ? [data.audio_url] : [])
    ].filter(Boolean);

    fotosLightbox = fotosVisor;


    // ===============================
    //   SWIPE PARA EL LIGHTBOX
    // ===============================
    let startX = 0;
    let endX = 0;

    const lightbox = document.getElementById("lightbox");

    lightbox.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    lightbox.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        if (Math.abs(diff) < 50) return;

        if (diff > 0) lightboxAnterior();
        else lightboxSiguiente();
    });


    // ============================
    // PLANTILLA UNIFICADA
    // ============================

    let html = "";

    servicios = servicios.map(s => s.charAt(0).toUpperCase() + s.slice(1));
    normas = normas.map(n => n.charAt(0).toUpperCase() + n.slice(1));


    // -------------------------------------
    // ANUNCIO
    // -------------------------------------
    if (data.tipo_post === "anuncio") {

        fetch(`http://localhost:3000/posts/${data.id}/visita`, { method: "POST" });

        html = `
        <h1>💗 ${data.titulo}</h1>

        <img src="${data.portada_url}" class="popup-foto-principal" onclick="abrirLightbox(0)">

        <p class="info-line">📍 <strong>${data.provincia}</strong> · ${data.ciudad}</p>
        <p class="info-line">🌍 ${data.nacionalidad} · 🎂 ${data.edad} años</p>
        <p class="info-line price">💸 <strong>${data.precio} €</strong></p>

        <h2>📝 Descripción</h2>
        <p class="descripcion">${data.descripcion || "Sin descripción"}</p>

        ${data.video_url ? `
            <h2>🎥 Video</h2>
            <video controls class="detalle-video" style="width:100%;border-radius:10px;margin:10px 0;">
                <source src="${data.video_url}">
            </video>
        ` : ""}

        ${data.audio_url ? `
            <h2>🎧 Audio</h2>
            <audio controls class="detalle-audio" style="width:100%;margin:10px 0;">
                <source src="${data.audio_url}">
            </audio>
        ` : ""}

        <h2>✨ Servicios</h2>
        <div class="servicios-columnas">
            ${servicios.length > 0
                ? servicios.map(s => `<div class="servicio-item">${s}</div>`).join("")
                : "<div class='servicio-item'>No especificados</div>"
            }
        </div>

        <h2>📸 Galería</h2>
        <div class="popup-galeria">
${fotosVisor.map((f, i) => {

                const esVideo = dataDetalle?.video_url && f === dataDetalle.video_url;
                const esAudio = dataDetalle?.audio_url && f === dataDetalle.audio_url;

                if (esAudio) {
                    return `
            <div class="thumb-audio" onclick="abrirLightbox(${i})">
            </div>
        `;
                }

                if (esVideo) {
                    return `
            <div class="thumb-video" onclick="abrirLightbox(${i})">
            </div>
        `;
                }

                return `<img src="${f}" onclick="abrirLightbox(${i})">`;

            }).join("")}

        </div>

        <div class="popup-actions-row">
            <a class="popup-btn-row btn-llamar" href="tel:${data.telefono}">📞 Llamar</a>
            <a class="popup-btn-row btn-whatsapp" href="https://wa.me/${data.telefono}">💬 WhatsApp</a>     
        </div>
    `;
    }


    // -------------------------------------
    // HABITACIÓN
    // -------------------------------------
    else if (data.tipo_post === "habitacion") {

        fetch(`http://localhost:3000/habitaciones/${data.id}/visita`, { method: "POST" });

        html = `
            <h1>🏠 ${data.titulo}</h1>

            <img src="${data.portada_url}" class="popup-foto-principal" onclick="abrirLightbox(0)">

            <p class="info-line">📍 <strong>${data.provincia}</strong> · ${data.ciudad}</p>

            <p class="info-line">🛏️ Habitaciones: <strong>${data.numero_habitaciones || "—"}</strong></p>

            <p class="info-line">🏷️ Tipo: <strong>${tipoHabitacion.join(", ")}</strong></p>

            <p class="info-line price">💸 <strong>${data.precio_semana} €/semana</strong></p>

            <h2>📝 Descripción</h2>
            <p class="descripcion">${data.descripcion || "Sin descripción"}</p>

            <h2>✨ Servicios incluidos</h2>
            <div class="servicios-columnas">
                ${servicios.length > 0
                ? servicios.map(s => `<div class="servicio-item">${s}</div>`).join("")
                : "<div class='servicio-item'>No especificados</div>"
            }
            </div>

            <h2>📌 Normas</h2>
            <div class="servicios-columnas">
                ${normas.length > 0
                ? normas.map(n => `<div class="servicio-item">${n}</div>`).join("")
                : "<div class='servicio-item'>No especificadas</div>"
            }
            </div>

            <h2>📸 Galería</h2>
            <div class="popup-galeria">
                ${fotosVisor.map((f, i) => {

                const esVideo = dataDetalle?.video_url && f === dataDetalle.video_url;
                const esAudio = dataDetalle?.audio_url && f === dataDetalle.audio_url;

                if (esAudio) {
                    return `
            <div class="thumb-audio" onclick="abrirLightbox(${i})">
            </div>
        `;
                }

                if (esVideo) {
                    return `
            <div class="thumb-video" onclick="abrirLightbox(${i})">
            </div>
        `;
                }

                return `<img src="${f}" onclick="abrirLightbox(${i})">`;

            }).join("")}

            </div>

            ${data.video_url ? `
                <h2>🎥 Video</h2>
                <video controls class="detalle-video" style="width:100%;border-radius:10px;margin:10px 0;">
                    <source src="${data.video_url}">
                </video>
            ` : ""}

            ${data.audio_url ? `
                <h2>🎧 Audio</h2>
                <audio controls class="detalle-audio" style="width:100%;margin:10px 0;">
                    <source src="${data.audio_url}">
                </audio>
            ` : ""}

            <div class="popup-actions-row">
                <a class="popup-btn-row btn-llamar" href="tel:${data.telefono}">📞 Llamar</a>
                <a class="popup-btn-row btn-whatsapp" href="https://wa.me/${data.telefono}">💬 WhatsApp</a>     
            </div>
        `;
    }

    // Insertar en el popup
    document.getElementById("detalle-info").innerHTML = html;
}
// ============================
// INIT
// ============================
document.getElementById("popup-detalle").addEventListener("click", (e) => {
    if (e.target.id === "popup-detalle") {
        cerrarDetalle();
    }
});

document.addEventListener("DOMContentLoaded", async () => {

    // ANUNCIOS PÚBLICOS
    const resAnuncios = await fetch("http://localhost:3000/posts/public");
    const anunciosData = await resAnuncios.json();

    // HABITACIONES PÚBLICAS
    const resHabitaciones = await fetch("http://localhost:3000/habitaciones/public");
    const habitacionesData = await resHabitaciones.json();

    // Unificar ambos tipos en un solo array
    anuncios = [
        // ============================
        // ANUNCIOS
        // ============================
        ...(Array.isArray(anunciosData) ? anunciosData : anunciosData.anuncios || []).map(a => ({
            ...a,
            categoria: normalizarCategoria(a.categoria),
            provincia: a.provincia || "",
            ciudad: a.ciudad || "",
            titulo: a.titulo || "",
            descripcion: a.descripcion || "",
            tipo_post: "anuncio"
        })),

        // ============================
        // HABITACIONES
        // ============================
        ...(Array.isArray(habitacionesData) ? habitacionesData : []).map(h => ({
            ...h,
            categoria: "habitacion",
            provincia: h.provincia || "",
            ciudad: h.ciudad || "",
            titulo: h.titulo || "",
            descripcion: h.descripcion || "",
            tipo_post: "habitacion",

            // ⭐⭐ AÑADIDO: NORMALIZAR PLAN COMO EN ANUNCIOS ⭐⭐
            plan: h.plan || {
                id: h.plan_id || null,
                nombre: h.plan_nombre || null
            }
        }))
    ];


    // Inicializar filtros
    rellenarFiltros();

    // Restaurar filtros guardados
    window._inicializandoFiltros = true;

    let filtrosGuardados = {};
    try {
        const raw = localStorage.getItem("filtros");
        filtrosGuardados = raw ? JSON.parse(raw) : {};
    } catch {
        filtrosGuardados = {};
    }

    if (filtrosGuardados.categoria)
        document.getElementById("filtro-categoria").value = filtrosGuardados.categoria;

    if (filtrosGuardados.provincia) {
        document.getElementById("filtro-provincia").value = filtrosGuardados.provincia;

        const selCiudad = document.getElementById("filtro-ciudad");
        selCiudad.innerHTML = `<option value="">Ciudad</option>`;

        if (ciudades[filtrosGuardados.provincia]) {
            ciudades[filtrosGuardados.provincia].forEach(c => {
                selCiudad.innerHTML += `<option value="${c}">${c}</option>`;
            });
        }
    }

    if (filtrosGuardados.ciudad)
        document.getElementById("filtro-ciudad").value = filtrosGuardados.ciudad;

    if (filtrosGuardados.texto)
        document.getElementById("filtro-texto").value = filtrosGuardados.texto;

    window._inicializandoFiltros = false;

    // Cargar anuncios filtrados
    cargarAnuncios();

    // Eventos de filtros
    document.getElementById("filtro-categoria").addEventListener("change", cargarAnuncios);
    document.getElementById("filtro-provincia").addEventListener("change", cargarAnuncios);
    document.getElementById("filtro-ciudad").addEventListener("change", cargarAnuncios);
    document.getElementById("filtro-texto").addEventListener("input", cargarAnuncios);
});
