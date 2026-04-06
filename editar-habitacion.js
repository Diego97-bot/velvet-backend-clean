// ===============================
// LISTAS DE PROVINCIAS Y CIUDADES
// ===============================
const provincias = [
    "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila",
    "Badajoz", "Barcelona", "Burgos",
    "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ceuta", "Ciudad Real", "Córdoba", "Cuenca",
    "Girona", "Granada", "Guadalajara", "Guipúzcoa",
    "Huelva", "Huesca",
    "Illes Balears",
    "Jaén",
    "La Coruña", "La Rioja", "Las Palmas", "León", "Lleida", "Lugo",
    "Madrid", "Málaga", "Melilla", "Murcia",
    "Navarra",
    "Ourense",
    "Palencia", "Pontevedra",
    "Salamanca", "Santa Cruz de Tenerife", "Segovia", "Sevilla", "Soria",
    "Tarragona", "Teruel", "Toledo",
    "Valencia", "Valladolid", "Vizcaya",
    "Zamora", "Zaragoza"
];

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



// ===============================
// CARGAR PROVINCIAS Y CIUDADES
// ===============================
function cargarProvincias() {
    const select = document.getElementById("provincia");
    select.innerHTML = `<option value="">Selecciona provincia</option>`;
    provincias.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        select.appendChild(opt);
    });
}

function cargarCiudades(prov) {
    const select = document.getElementById("ciudad");
    select.innerHTML = `<option value="">Selecciona ciudad</option>`;
    if (!ciudades[prov]) return;
    ciudades[prov].forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        select.appendChild(opt);
    });
}

document.getElementById("provincia").addEventListener("change", e => {
    cargarCiudades(e.target.value);
});

cargarProvincias();

// ===============================
// OBTENER ID DE HABITACIÓN
// ===============================
const params = new URLSearchParams(window.location.search);
const habitacionId = params.get("id");

// Variables globales
let portadaOriginal = null;
let portadaOriginalId = null;
let fotosOriginales = [];
let fotosOriginalesIds = [];

let videoOriginal = null;
let audioOriginal = null;

// ===============================
// CARGAR DATOS DE HABITACIÓN
// ===============================
async function cargarDatos() {
    const res = await fetch(`http://localhost:3000/habitaciones/${habitacionId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });

    const json = await res.json();
    if (!json.ok) {
        console.error(json.error);
        return;
    }

    const data = json.habitacion;

    // PORTADA
    portadaOriginal = data.portada_url || null;
    portadaOriginalId = data.id_portada || null;

    // GALERÍA
    fotosOriginales = (data.galeria || []).map(f => f.url);
    fotosOriginalesIds = (data.galeria || []).map(f => f.id);

    // VIDEO
    videoOriginal = data.video_url || null;
    if (videoOriginal) {
        document.getElementById("row-video").style.display = "block";
        document.getElementById("preview-video").innerHTML = `
            <div class="foto-item">
                <video src="${videoOriginal}" controls style="max-width:200px"></video>
                <button onclick="eliminarVideo()" class="btn-delete-media">✖</button>
            </div>
        `;
    }

    // AUDIO
    audioOriginal = data.audio_url || null;
    if (audioOriginal) {
        document.getElementById("row-audio").style.display = "block";
        document.getElementById("preview-audio").innerHTML = `
            <div class="foto-item">
                <audio src="${audioOriginal}" controls></audio>
                <button onclick="eliminarAudio()" class="btn-delete-media">✖</button>
            </div>
        `;
    }

    // CAMPOS
    document.getElementById("titulo").value = data.titulo || "";
    document.getElementById("descripcion").value = data.descripcion || "";
    document.getElementById("telefono").value = data.telefono || "";
    document.getElementById("numero_habitaciones").value = data.numero_habitaciones || "";
    document.getElementById("normas").value = data.normas || "";
    document.getElementById("precio_semana").value = data.precio_semana || "";

    const provinciaSelect = document.getElementById("provincia");
    provinciaSelect.value = data.provincia || "";
    cargarCiudades(data.provincia);
    document.getElementById("ciudad").value = data.ciudad || "";

    // Tipo de habitación
    let tiposArray = [];
    try { tiposArray = JSON.parse(data.tipo_habitacion); } catch { tiposArray = data.tipo_habitacion || []; }

    tiposArray.forEach(t => {
        const check = document.querySelector(`.tipo-box input[value="${t}"]`);
        if (check) check.checked = true;
    });

    // Servicios
    let serviciosArray = [];
    try { serviciosArray = JSON.parse(data.servicios); } catch { serviciosArray = data.servicios || []; }

    serviciosArray.forEach(s => {
        const check = document.querySelector(`.servicios-box input[value="${s}"]`);
        if (check) check.checked = true;
    });
    habitacionData = data;
 
    renderPortada(portadaOriginal);
    renderGaleria(fotosOriginales);
}


async function cargarPlanHabitacion() {
    if (!habitacionId) return;

    const res = await fetch(`http://localhost:3000/planes/${habitacionData.plan_id}`);
    const plan = await res.json();

    // Guardamos el plan
    const maxFotos = plan.max_fotos;
    const maxTamano = plan.max_tamano_foto;
    const maxVideos = plan.max_videos;
    const maxAudios = plan.max_audios;

    // Guardamos límites en el input de galería
    const galeriaInput = document.getElementById("galeria");
    galeriaInput.dataset.maxFotos = maxFotos;
    galeriaInput.dataset.maxTamanoFoto = maxTamano;

    // Mostrar u ocultar VIDEO
    if (maxVideos > 0) {
        document.getElementById("row-video").style.display = "block";
    } else {
        document.getElementById("row-video").style.display = "none";
    }

    // Mostrar u ocultar AUDIO
    if (maxAudios > 0) {
        document.getElementById("row-audio").style.display = "block";
    } else {
        document.getElementById("row-audio").style.display = "none";
    }
}

cargarDatos().then(cargarPlanHabitacion);



// ===============================
// PREVIEW PORTADA NUEVA
// ===============================
document.getElementById("foto-portada").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    portadaOriginal = url;
    renderPortada(url);
});



// ===============================
// PREVIEW GALERÍA NUEVA
// ===============================
document.getElementById("galeria").addEventListener("change", e => {
    const files = [...e.target.files];
    files.forEach(file => {
        const url = URL.createObjectURL(file);
        fotosOriginales.push(url);
    });
    renderGaleria(fotosOriginales);
});

// ===============================
// PREVIEW VIDEO NUEVO
// ===============================
document.getElementById("video").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    document.getElementById("preview-video").innerHTML = `
        <div class="foto-item">
            <video src="${url}" controls style="max-width:200px"></video>
            <button onclick="eliminarVideo() class="btn-delete-media">✖</button>
        </div>
    `;

    videoOriginal = null; // marca para borrar si no se sube nuevo
});

// ===============================
// PREVIEW AUDIO NUEVO
// ===============================
document.getElementById("audio").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    document.getElementById("preview-audio").innerHTML = `
        <div class="foto-item">
            <audio src="${url}" controls></audio>
            <button onclick="eliminarAudio()" class="btn-delete-media">✖</button>
        </div>
    `;

    audioOriginal = null;
});

// ===============================
// RENDER PORTADA
// ===============================
function renderPortada(url) {
    const div = document.getElementById("preview-portada");
    div.innerHTML = "";
    if (!url) return;

    // Si es vídeo
    if (url.endsWith(".mp4") || url.includes("video")) {
        div.innerHTML = `
            <div class="foto-item">
                <video src="${url}" controls autoplay muted loop style="max-width:200px"></video>
                <button class="btn-delete-foto" onclick="eliminarPortada()">✖</button>
            </div>
        `;
        return;
    }

    // Si es foto
    div.innerHTML = `
        <div class="foto-item">
            <img src="${url}">
            <button class="btn-delete-foto" onclick="eliminarPortada()">✖</button>
        </div>
    `;
}


// ===============================
// RENDER GALERÍA
// ===============================
function renderGaleria() {
    const div = document.getElementById("preview-galeria");
    div.innerHTML = "";

    // Actualizar input hidden con los IDs reales
    document.querySelector("#galeria_original_id").value =
        JSON.stringify(fotosOriginalesIds);

    fotosOriginales.forEach((url, index) => {
        div.innerHTML += `
            <div class="foto-item">
                <img src="${url}">
                <button class="btn-delete-foto" onclick="eliminarFoto(${index})">✖</button>
            </div>
        `;
    });
}



// ===============================
// ELIMINAR PORTADA
// ===============================
function eliminarPortada() {
    portadaOriginal = null;
    portadaOriginalId = null;
    renderPortada(null);
}

// ===============================
// ELIMINAR FOTO DE GALERÍA
// ===============================
function eliminarFoto(index) {
    // 1. Eliminar de arrays
    fotosOriginales.splice(index, 1);
    fotosOriginalesIds.splice(index, 1);

    // 2. Resetear input file (CLAVE)
    document.querySelector("#galeria").value = "";

    // 3. Volver a renderizar (actualiza hidden automáticamente)
    renderGaleria();
}


// ===============================
// ELIMINAR VIDEO
// ===============================
function eliminarVideo() {
    videoOriginal = null;
    document.getElementById("video").value = "";
    document.getElementById("preview-video").innerHTML = "";
}

// ===============================
// ELIMINAR AUDIO
// ===============================
function eliminarAudio() {
    audioOriginal = null;
    document.getElementById("audio").value = "";
    document.getElementById("preview-audio").innerHTML = "";
}


// ===============================
// GUARDAR CAMBIOS (PUT)
// ===============================
document.getElementById("btn-guardar").addEventListener("click", async () => {
    const formData = new FormData();
    formData.append("portada_original_id", portadaOriginalId || "");
    formData.append("portada_original_url", portadaOriginal || "");
    formData.append("titulo", document.getElementById("titulo").value);
    formData.append("descripcion", document.getElementById("descripcion").value);
    formData.append("provincia", document.getElementById("provincia").value);
    formData.append("ciudad", document.getElementById("ciudad").value);
    formData.append("telefono", document.getElementById("telefono").value);
    formData.append("numero_habitaciones", document.getElementById("numero_habitaciones").value);
    formData.append("normas", document.getElementById("normas").value);
    formData.append("precio_semana", document.getElementById("precio_semana").value);

    const tipos = [...document.querySelectorAll(".tipo-box input:checked")].map(c => c.value);
    const servicios = [...document.querySelectorAll(".servicios-box input:checked")].map(c => c.value);

    formData.append("tipo_habitacion", JSON.stringify(tipos));
    formData.append("servicios", JSON.stringify(servicios));

    // PORTADA
    const fotoPortada = document.getElementById("foto-portada");
    if (fotoPortada.files.length > 0) {
        formData.append("portada", fotoPortada.files[0]);
    }


    // GALERÍA ORIGINAL
    fotosOriginalesIds.forEach(id => formData.append("galeria_original_id", id));

    // GALERÍA NUEVA
    const galeriaInput = document.getElementById("galeria");
    for (let file of galeriaInput.files) {
        formData.append("galeria_nueva", file);
    }

    // VIDEO
    const videoFile = document.getElementById("video").files[0];
    if (videoFile) {
        formData.append("video", videoFile);
    } else if (!videoOriginal) {
        formData.append("eliminar_video", "1");
    }

    // AUDIO
    const audioFile = document.getElementById("audio").files[0];
    if (audioFile) {
        formData.append("audio", audioFile);
    } else if (!audioOriginal) {
        formData.append("eliminar_audio", "1");
    }

    const res = await fetch(`http://localhost:3000/habitaciones/${habitacionId}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: formData
    });

    const data = await res.json();

    if (data.ok) {
        alert("Habitación actualizada correctamente");
        window.location.href = "/mi-cuenta.html";
    } else {
        alert(data.error ?? "Error: has superado el límite de archivos permitido por tu plan.");

        console.error(data.error);
    }
});

document.getElementById("btn-cancelar").addEventListener("click", () => {
    if (confirm("¿Seguro que quieres cancelar? Se perderán los cambios.")) {
        window.location.href = "/mi-cuenta.html";
    }
});
