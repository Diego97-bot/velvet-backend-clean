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
// OBTENER ID DEL ANUNCIO
// ===============================
const params = new URLSearchParams(window.location.search);
const anuncioId = params.get("id");

// Variables globales
let anuncioData = null;
let portadaOriginal = null;
let portadaOriginalId = null;
let fotosOriginales = [];
let fotosOriginalesIds = [];
let nuevasFotosArchivos = []; // archivos reales de nuevas fotos

// ===============================
// CARGAR DATOS DEL ANUNCIO
// ===============================
async function cargarDatos() {
    const res = await fetch(`http://localhost:3000/posts/${anuncioId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    });

    const json = await res.json();

    // El backend devuelve { ok, anuncio }
    const data = json.anuncio;

    // Guardar anuncio globalmente
    anuncioData = data;
    window.anuncioData = data;

    console.log("EXTRAS DEL ANUNCIO:", data.extras);

    // ===============================
    // MOSTRAR / OCULTAR INPUT DE VIDEO PORTADA
    // ===============================
    const boxVideoPortada = document.getElementById("video-portada-box");

    const tieneExtraVideo =
        Array.isArray(data.extras) &&
        data.extras.includes("video_destacado");

    if (!tieneExtraVideo) {
        boxVideoPortada.style.display = "none";
    } else {
        boxVideoPortada.style.display = "block";
    }

    // ===============================
    // GUARDAR DATOS ORIGINALES
    // ===============================
    portadaOriginal = data.portada_url || null;
    portadaOriginalId = data.id_foto_portada || null;

    fotosOriginales = data.galeria.map(f => f.url);
    fotosOriginalesIds = data.galeria.map(f => f.id);

    // ===============================
    // RELLENAR FORMULARIO
    // ===============================
    titulo.value = data.titulo;
    categoria.value = data.categoria;
    descripcion.value = data.descripcion;
    provincia.value = data.provincia;

    cargarCiudades(data.provincia);
    ciudad.value = data.ciudad;

    telefono.value = data.telefono;
    edad.value = data.edad;
    nacionalidad.value = data.nacionalidad;
    precio.value = data.precio;

    // Servicios
    let serviciosArray = Array.isArray(data.servicios)
        ? data.servicios
        : JSON.parse(data.servicios || "[]");

    serviciosArray.forEach(serv => {
        const check = document.querySelector(`input[value="${serv}"]`);
        if (check) check.checked = true;
    });

    // ===============================
    // RENDERIZAR ELEMENTOS
    // ===============================
    renderPortada(portadaOriginal, data.portada_tipo || "foto");
    renderGaleria(fotosOriginales);
    renderVideoOriginal();
    renderAudioOriginal();
}

// ===============================
// CARGAR PLAN DEL ANUNCIO
// ===============================
async function cargarPlanAnuncio() {
    const planId = anuncioData.plan_id;
    const res = await fetch(`http://localhost:3000/planes/${planId}`);
    const plan = await res.json();

    window.planAnuncio = plan;

    if (plan.max_videos > 0) {
        document.getElementById("row-video").style.display = "block";
    }

    if (plan.max_audios > 0) {
        document.getElementById("row-audio").style.display = "block";
    }
}

// ===============================
// EJECUCIÓN
// ===============================
cargarDatos().then(() => cargarPlanAnuncio());

// ===============================
// PREVIEW PORTADA NUEVA
// ===============================
document.getElementById("foto-portada").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    // Solo vista previa como foto
    renderPortada(url, "foto");

    // Marcamos que ya no usamos la portada original
    portadaOriginal = null;
    portadaOriginalId = null;
    anuncioData.portada_eliminada = true;
});


// ===============================
// PREVIEW PORTADA NUEVA (VIDEO)
// ===============================
const inputVideoPortada = document.getElementById("video-portada");

if (inputVideoPortada) {
    inputVideoPortada.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) return;

        // Seguridad extra: bloquear si no tiene el extra
        if (!anuncioData.extras || !anuncioData.extras.includes("video_destacado")) {
            alert("Necesitas el extra Vídeo Destacado para usar un vídeo como portada.");
            e.target.value = "";
            return;
        }

        const url = URL.createObjectURL(file);

        // Renderizar como vídeo
        renderPortada(url, "video");

        // Marcar que la portada original ya no se usa
        portadaOriginal = null;
        portadaOriginalId = null;
        anuncioData.portada_eliminada = true;
    });
}


// ===============================
// PREVIEW GALERÍA NUEVA
// ===============================
document.getElementById("galeria").addEventListener("change", e => {
    const files = [...e.target.files];
    nuevasFotosArchivos = files;

    const previews = files.map(f => URL.createObjectURL(f));
    renderGaleria([...fotosOriginales, ...previews]);
});

// ===============================
// RENDER PORTADA
// ===============================
function renderPortada(url, tipo = "foto") {
    const div = document.getElementById("preview-portada");
    div.innerHTML = "";
    if (!url) return;

    // Si la portada es un VIDEO
    if (tipo === "video") {
        div.innerHTML = `
            <div class="foto-item">
                <video src="${url}" controls autoplay muted loop style="max-width:200px"></video>
                <button class="btn-delete-foto" onclick="eliminarPortada()">✖</button>
            </div>
        `;
        return;
    }

    // Si la portada es una FOTO
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
function renderGaleria(lista) {
    const div = document.getElementById("preview-galeria");
    div.innerHTML = "";
    lista.forEach((url, index) => {
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
    const inputFoto = document.getElementById("foto-portada");
    const inputVideo = document.getElementById("video-portada");
    const preview = document.getElementById("preview-portada");

    // Limpiar inputs
    if (inputFoto) inputFoto.value = "";
    if (inputVideo) inputVideo.value = "";

    // Marcar que la portada original debe eliminarse
    portadaOriginal = null;
    portadaOriginalId = null;
    anuncioData.portada_eliminada = true;

    // Borrar vista previa
    if (preview) preview.innerHTML = "";
}

// ===============================
// ELIMINAR FOTO DE GALERÍA
// ===============================
function eliminarFoto(index) {
    if (index < fotosOriginales.length) {
        fotosOriginales.splice(index, 1);
        fotosOriginalesIds.splice(index, 1);
    } else {
        const relativeIndex = index - fotosOriginales.length;
        nuevasFotosArchivos.splice(relativeIndex, 1);
    }

    const previews = nuevasFotosArchivos.map(f => URL.createObjectURL(f));
    renderGaleria([...fotosOriginales, ...previews]);
}

// ===============================
// VIDEO ORIGINAL + NUEVO
// ===============================
const inputVideo = document.getElementById("video");
const previewVideo = document.getElementById("preview-video");

function eliminarVideo() {
    anuncioData.video_url = null;
    anuncioData.video_ruta = null;
    previewVideo.innerHTML = "";
}

function renderVideoOriginal() {
    previewVideo.innerHTML = "";

    if (anuncioData?.video_url) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("foto-item");

        const video = document.createElement("video");
        video.src = anuncioData.video_url;
        video.controls = true;
        video.style.maxWidth = "200px";

        const btn = document.createElement("button");
        btn.classList.add("btn-delete-foto");
        btn.textContent = "✖";
        btn.onclick = eliminarVideo;

        wrapper.appendChild(video);
        wrapper.appendChild(btn);
        previewVideo.appendChild(wrapper);
    }
}

inputVideo.addEventListener("change", () => {
    previewVideo.innerHTML = "";

    const file = inputVideo.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const wrapper = document.createElement("div");
    wrapper.classList.add("foto-item");

    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    video.style.maxWidth = "200px";

    const btn = document.createElement("button");
    btn.classList.add("btn-delete-foto");
    btn.textContent = "✖";
    btn.onclick = () => {
        inputVideo.value = "";
        anuncioData.video_url = null;
        anuncioData.video_ruta = null;
        previewVideo.innerHTML = "";
    };

    wrapper.appendChild(video);
    wrapper.appendChild(btn);
    previewVideo.appendChild(wrapper);

    anuncioData.video_url = "nuevo";
});

// ===============================
// AUDIO ORIGINAL + NUEVO
// ===============================
const inputAudio = document.getElementById("audio");
const previewAudio = document.getElementById("preview-audio");

function eliminarAudio() {
    anuncioData.audio_url = null;
    anuncioData.audio_ruta = null;
    previewAudio.innerHTML = "";
}

function renderAudioOriginal() {
    previewAudio.innerHTML = "";

    if (anuncioData?.audio_url) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("foto-item");

        const audio = document.createElement("audio");
        audio.src = anuncioData.audio_url;
        audio.controls = true;

        const btn = document.createElement("button");
        btn.classList.add("btn-delete-foto");
        btn.textContent = "✖";
        btn.onclick = eliminarAudio;

        wrapper.appendChild(audio);
        wrapper.appendChild(btn);
        previewAudio.appendChild(wrapper);
    }
}

inputAudio.addEventListener("change", () => {
    previewAudio.innerHTML = "";

    const file = inputAudio.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const wrapper = document.createElement("div");
    wrapper.classList.add("foto-item");

    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;

    const btn = document.createElement("button");
    btn.classList.add("btn-delete-foto");
    btn.textContent = "✖";
    btn.onclick = () => {
        inputAudio.value = "";
        anuncioData.audio_url = null;
        anuncioData.audio_ruta = null;
        previewAudio.innerHTML = "";
    };

    wrapper.appendChild(audio);
    wrapper.appendChild(btn);
    previewAudio.appendChild(wrapper);

    anuncioData.audio_url = "nuevo";
});

// ===============================
// GUARDAR CAMBIOS (PUT)
// ===============================
// ===============================
// GUARDAR CAMBIOS
// ===============================
document.getElementById("btn-guardar").addEventListener("click", async () => {

    // Limpieza: eliminar blobs de la galería original
    fotosOriginales = fotosOriginales.filter(url => !url.startsWith("blob:"));

    const formData = new FormData();

    // ===============================
    // CAMPOS BÁSICOS
    // ===============================
    formData.append("titulo", titulo.value);
    formData.append("categoria", categoria.value);
    formData.append("descripcion", descripcion.value);
    formData.append("provincia", provincia.value);
    formData.append("ciudad", ciudad.value);
    formData.append("telefono", telefono.value);
    formData.append("edad", edad.value);
    formData.append("nacionalidad", nacionalidad.value);
    formData.append("precio", precio.value);

    const servicios = [...document.querySelectorAll(".servicios-box input:checked")]
        .map(c => c.value);
    formData.append("servicios", JSON.stringify(servicios));

    // ===============================
    // PORTADA (FOTO O VIDEO)
    // ===============================
    const fotoPortada = document.getElementById("foto-portada");
    const videoPortada = document.getElementById("video-portada");

    const nuevaFoto = fotoPortada?.files[0] || null;
    const nuevoVideo = videoPortada?.files[0] || null;

    // 1. Si sube un VIDEO → prioridad absoluta
    if (nuevoVideo) {
        formData.append("portada_video", nuevoVideo);
        formData.append("portada_eliminada", "1");
    }

    // 2. Si sube una FOTO
    else if (nuevaFoto) {
        formData.append("portada", nuevaFoto);
        formData.append("portada_eliminada", "1");
    }

    // 3. Si eliminó la portada y no subió nada
    else if (anuncioData.portada_eliminada) {
        formData.append("portada_eliminada", "1");
    }

    // 4. Mantener portada original
    else {
        formData.append("portada_original", portadaOriginal || "");
        formData.append("portada_original_id", portadaOriginalId || "");
    }

    // ===============================
    // GALERÍA ORIGINAL
    // ===============================
    fotosOriginales.forEach(url => formData.append("galeria_original", url));
    fotosOriginalesIds.forEach(id => formData.append("galeria_original_id", id));

    // ===============================
    // GALERÍA NUEVA
    // ===============================
    for (let file of nuevasFotosArchivos) {
        formData.append("galeria_nueva", file);
    }

    // ===============================
    // VIDEO NORMAL
    // ===============================
    const video = inputVideo.files[0];
    if (video) {
        formData.append("video", video);
    } else if (!anuncioData.video_url) {
        formData.append("eliminar_video", "1");
    }

    // ===============================
    // AUDIO NORMAL
    // ===============================
    const audio = inputAudio.files[0];
    if (audio) {
        formData.append("audio", audio);
    } else if (!anuncioData.audio_url) {
        formData.append("eliminar_audio", "1");
    }

    // ===============================
    // PETICIÓN AL BACKEND
    // ===============================
    const res = await fetch(`http://localhost:3000/posts/${anuncioId}`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: formData
    });

    const data = await res.json();

    if (data.ok) {
        alert("Anuncio actualizado correctamente");
        window.location.href = "/mi-cuenta.html";
    } else {
        alert(data.error ?? "Error: has superado el límite de archivos permitido por tu plan.");
        console.log("ERROR BACKEND:", data);
    }
});

