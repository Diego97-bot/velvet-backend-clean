// PROVINCIAS
const provincias = [
    "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila",
    "Badajoz", "Barcelona", "Burgos",
    "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ceuta", "Ciudad Real", "Córdoba", "Cuenca",
    "Gerona", "Granada", "Guadalajara", "Guipúzcoa",
    "Huelva", "Huesca",
    "Islas Baleares",
    "Jaén",
    "La Coruña", "La Rioja", "Las Palmas", "León", "Lérida", "Lugo",
    "Madrid", "Málaga", "Melilla", "Murcia",
    "Navarra",
    "Orense",
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
};// ===============================
// PREVIEW FOTO DE PORTADA
// ===============================
const portadaInput = document.getElementById("portada");
const previewPortada = document.getElementById("preview-portada");

portadaInput.addEventListener("change", () => {
    previewPortada.innerHTML = "";

    const file = portadaInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
        const div = document.createElement("div");
        div.classList.add("preview-item");

        div.innerHTML = `
            <img src="${e.target.result}">
            <button class="preview-remove">✖</button>
        `;

        div.querySelector(".preview-remove").onclick = () => {
            portadaInput.value = "";
            previewPortada.innerHTML = "";
        };

        previewPortada.appendChild(div);
    };

    reader.readAsDataURL(file);
});


// ===============================
// PREVIEW GALERÍA MULTIPLE
// ===============================
const galeriaInput = document.getElementById("galeria");
const previewGaleria = document.getElementById("preview-galeria");

let galeriaFiles = [];

function renderGaleriaPreview() {
    previewGaleria.innerHTML = "";

    galeriaFiles.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = e => {
            const div = document.createElement("div");
            div.classList.add("preview-item");

            div.innerHTML = `
                <img src="${e.target.result}">
                <button class="preview-remove" data-index="${index}">✖</button>
            `;

            div.querySelector(".preview-remove").onclick = (ev) => {
                const i = ev.target.getAttribute("data-index");
                galeriaFiles.splice(i, 1);
                renderGaleriaPreview();
            };

            previewGaleria.appendChild(div);
        };

        reader.readAsDataURL(file);
    });

    const dataTransfer = new DataTransfer();
    galeriaFiles.forEach(f => dataTransfer.items.add(f));
    galeriaInput.files = dataTransfer.files;
}

galeriaInput.addEventListener("change", () => {
    const files = Array.from(galeriaInput.files);

    galeriaFiles = galeriaFiles.concat(files);

    if (galeriaFiles.length > 3) {
        galeriaFiles = galeriaFiles.slice(0, 3);
        alert("Máximo 3 fotos en la galería.");
    }

    renderGaleriaPreview();
});


// ===============================
// CARGAR PROVINCIAS Y CIUDADES
// ===============================
function cargarProvincias() {
    const selectProvincia = document.getElementById("provincia");
    selectProvincia.innerHTML = `<option value="">Selecciona provincia</option>`;

    provincias.forEach(prov => {
        selectProvincia.innerHTML += `<option value="${prov}">${prov}</option>`;
    });
}

document.getElementById("provincia").addEventListener("change", (e) => {
    const provincia = e.target.value;
    const listaCiudades = ciudades[provincia] || [];

    const selectCiudad = document.getElementById("ciudad");
    selectCiudad.innerHTML = `<option value="">Selecciona ciudad</option>`;

    listaCiudades.forEach(c => {
        selectCiudad.innerHTML += `<option value="${c}">${c}</option>`;
    });
});

cargarProvincias();


document.getElementById("btn-cancelar").addEventListener("click", () => {
    const salir = confirm("¿Seguro que quieres salir? Se perderán los datos no guardados.");
    if (salir) {
        window.location.href = "mi-cuenta.html";
    }

});

// ===============================
// BOTÓN GUARDAR
// ===============================
document.getElementById("btn-guardar").addEventListener("click", async () => {

    // 1. Recoger datos
    const titulo = document.getElementById("titulo").value;
    const descripcion = document.getElementById("descripcion").value;
    const provincia = document.getElementById("provincia").value;
    const ciudad = document.getElementById("ciudad").value;
    const telefono = document.getElementById("telefono").value;
    const numero_habitaciones = document.getElementById("numero_habitaciones").value;
    const normas = document.getElementById("normas").value;
    const precio_semana = document.getElementById("precio_semana").value;

    const tipo_habitacion = Array.from(
        document.querySelectorAll('input[name="tipo_habitacion[]"]:checked')
    ).map(s => s.value);

    const servicios = Array.from(
        document.querySelectorAll(".servicios-box input:checked")
    ).map(s => s.value);

    // 2. Crear FormData
    const formData = new FormData();

    formData.append("tipo", "habitacion");
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    formData.append("provincia", provincia);
    formData.append("ciudad", ciudad);
    formData.append("telefono", telefono);
    formData.append("numero_habitaciones", numero_habitaciones);
    formData.append("tipo_habitacion", JSON.stringify(tipo_habitacion));
    formData.append("servicios", JSON.stringify(servicios));
    formData.append("normas", normas);
    formData.append("precio_semana", precio_semana);

    // 3. Portada
    const portada = document.getElementById("portada").files[0];
    if (portada) {
        formData.append("portada", portada);
    }

    // 4. Galería
    const galeria = document.getElementById("galeria").files;
    for (let i = 0; i < galeria.length; i++) {
        formData.append("galeria", galeria[i]);
    }

    // 5. POST al backend
    const res = await fetch("http://localhost:3000/habitaciones", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: formData
    });

    const data = await res.json();

    if (data.ok) {
        alert("Habitación publicada correctamente");
        window.location.href = "mi-cuenta.html";
    } else {
        alert("Error al publicar habitación");
    }
});