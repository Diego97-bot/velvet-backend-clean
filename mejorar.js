// ===============================
// SUPABASE
// ===============================
const client = supabase.createClient(
    "https://wklcvgtqpxpizxgjdwzy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbGN2Z3RxcHhwaXp4Z2pkd3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODgwODUsImV4cCI6MjA4OTU2NDA4NX0.savsSVaXW8tG1xjhtOl6ItRnRqu7gWHw0xthglx9OrQ"
);

// ===============================
// USUARIO
// ===============================
let usuario = {
    id: null,
    planActivo: null,
    planSeleccionado: null,
    extrasSeleccionados: {},
    extrasActivos: {}
};

// ===============================
// OBTENER ID Y TIPO REAL
// ===============================
const urlParams = new URLSearchParams(window.location.search);
const ref_id = parseInt(urlParams.get("id"));
const tipoActual = urlParams.get("tipo") || "anuncio";

// ===============================
// CARGAR USUARIO REAL
// ===============================
async function cargarUsuario() {
    const usuarioId = parseInt(localStorage.getItem("usuario_id"));

    if (!usuarioId) return console.error("No hay usuario_id");
    if (!ref_id || isNaN(ref_id)) return console.error("❌ ref_id inválido:", ref_id);

    const tabla = tipoActual === "habitacion" ? "habitaciones" : "anuncios";

    const { data, error } = await client
        .from(tabla)
        .select("usuario_id, plan_id")
        .eq("id", ref_id)
        .single();

    if (error || !data) return console.error("❌ No se encontró el anuncio/habitación");
    if (data.usuario_id !== usuarioId) return console.error("❌ Este anuncio NO pertenece al usuario");

    usuario.id = usuarioId;
    usuario.planActivo = data.plan_id;

    console.log("✅ Plan cargado:", usuario.planActivo);
}

// ===============================
// PLANES
// ===============================
let planes = [];

async function cargarPlanes() {
    const { data, error } = await client
        .from("planes")
        .select("*")
        .order("id");

    if (error) return console.error("❌ Error cargando planes:", error);

    planes = data;
    renderPlanes();
    renderCarrito();
}

// ===============================
// CONFIG EXTRAS
// ===============================
const extrasConfig = {
    verificado: { acumulable: false },
    auto_subida_6h: { acumulable: true },
    subida_24h: { acumulable: true },
    boost_3dias: { acumulable: true }
};

// ===============================
// CARGAR EXTRAS ACTIVOS
// ===============================
async function cargarExtrasActivos() {
    const { data, error } = await client
        .from("mejoras")
        .select("mejora_id")
        .eq("tipo", tipoActual)
        .eq("ref_id", ref_id);

    if (error) return console.error("❌ Error cargando extras activos:", error);

    usuario.extrasActivos = {};

const mapa = {
    1: "verificado",
    2: "subida_24h",
    3: "auto_subida_6h",
    4: "boost_3dias"
};

    data.forEach(m => {
        const nombre = mapa[m.mejora_id];
        if (nombre) usuario.extrasActivos[nombre] = true;
    });

    console.log("Extras activos:", usuario.extrasActivos);
}

// ===============================
// EXTRAS
// ===============================
let extras = [];

async function cargarExtras() {
    const { data, error } = await client
        .from("micropagos")
        .select("*")
        .order("id");

    if (error) return console.error("❌ Error cargando extras:", error);

    extras = data
        .filter(e => e.nombre !== "anuncio_extra")
        .map(e => ({
            id: e.id,
            nombre: e.nombre_front,
            nombreInterno: e.nombre,
            precio: e.precio,
            desc: e.descripcion,
            acumulable: extrasConfig[e.nombre]?.acumulable ?? true
        }));

    extras.forEach(extra => {
        usuario.extrasSeleccionados[extra.nombreInterno] = false;
    });

    renderExtras();
    renderCarrito();
}

// ===============================
// VALIDACIÓN PLANES
// ===============================
function puedeSeleccionarPlan(planNombre) {
    if (!usuario.planActivo) return true;

    const planActual = planes.find(p => p.id === usuario.planActivo);
    const planNuevo = planes.find(p => p.nombre === planNombre);

    if (!planActual || !planNuevo) return false;

    return planNuevo.id > planActual.id;
}

// ===============================
// SELECCIONAR PLAN
// ===============================
function togglePlan(planNombre) {
    if (!puedeSeleccionarPlan(planNombre)) {
        alert("Solo puedes mejorar a un plan superior");
        return;
    }

    usuario.planSeleccionado =
        usuario.planSeleccionado === planNombre ? null : planNombre;

    renderPlanes();
    renderCarrito();
}

// ===============================
// SELECCIONAR EXTRA
// ===============================
function toggleExtra(nombre) {
    const extra = extras.find(e => e.nombreInterno === nombre);
    if (!extra) return;

    usuario.extrasSeleccionados[nombre] = !usuario.extrasSeleccionados[nombre];

    renderExtras();
    renderCarrito();
}

// ===============================
// RENDER PLANES
// ===============================
function renderPlanes() {
    const container = document.getElementById("planes-container");
    container.innerHTML = "";

    planes.forEach(plan => {
        const esActual = usuario.planActivo === plan.id;
        const esSeleccionado = usuario.planSeleccionado === plan.nombre;

        let clase = "plan-card";
        if (plan.nombre === "premium") clase += " premium";
        if (plan.nombre === "vip") clase += " vip";
        if (esSeleccionado) clase += " seleccionado";

        let badge = esActual ? `<div class="plan-badge">ACTUAL</div>` : "";

        let boton = "";
        if (esActual) {
            boton = `<button class="btn-plan" disabled>Plan actual</button>`;
        } else if (!puedeSeleccionarPlan(plan.nombre)) {
            boton = `<button class="btn-plan" disabled>No disponible</button>`;
        } else {
            boton = `<button class="btn-plan" onclick="togglePlan('${plan.nombre}')">
                        ${esSeleccionado ? "Quitar" : "Elegir"}
                     </button>`;
        }

        const html = `
            <div class="${clase}">
                ${badge}
                <h3>${plan.titulo || plan.nombre}</h3>
                <div class="plan-price">${plan.precio.toFixed(2)}€</div>
                <p class="plan-desc">${plan.descripcion.replace(/\n/g, "<br>")}</p>
                ${boton}
            </div>
        `;

        container.insertAdjacentHTML("beforeend", html);
    });
}

// ===============================
// RENDER EXTRAS
// ===============================
function renderExtras() {
    const container = document.getElementById("extras-container");
    container.innerHTML = "";

    extras.forEach(extra => {
        const nombre = extra.nombreInterno;

        const activo = usuario.extrasActivos?.[nombre] || false;
        const seleccionado = usuario.extrasSeleccionados[nombre] || false;

        const esAcumulable = extra.acumulable;

        let disponible = true;
        if (!esAcumulable && activo) disponible = false;

        let boton = "";
        if (!disponible) {
            boton = `<button class="btn-plan" disabled>No disponible</button>`;
        } else {
            boton = `
                <button class="btn-plan" onclick="toggleExtra('${nombre}')">
                    ${seleccionado ? "Quitar" : "Activar"}
                </button>
            `;
        }

        const html = `
            <div class="extra-card 
                ${seleccionado ? "seleccionado" : ""} 
                ${activo ? "activo" : ""}
            ">
                ${activo ? `<div class="extra-badge">ACTIVO</div>` : ""}
                
                <h4>${extra.nombre}</h4>
                <p>${extra.desc}</p>
                <div class="extra-price">${extra.precio.toFixed(2)}€</div>
                ${boton}

${nombre === "auto_subida_6h" && seleccionado
    ? `
        <div class="selector-fecha">
            <label>Hora de inicio:</label>
            <input type="time" id="horaInicioAutoSubida">
        </div>
    `
    : ""
}

            </div>
        `;

        container.insertAdjacentHTML("beforeend", html);
    });
}

// ===============================
// CARRITO
// ===============================
function renderCarrito() {
    const cont = document.getElementById("carrito-container");
    cont.innerHTML = "";
    let total = 0;

    if (usuario.planSeleccionado) {
        const plan = planes.find(p => p.nombre === usuario.planSeleccionado);

        cont.innerHTML += `
            <div class="carrito-item">
                <span>${plan.titulo || plan.nombre}</span>
                <span>
                    ${plan.precio.toFixed(2)}€
                    <button class="btn-eliminar-item" onclick="eliminarItem('plan')">X</button>
                </span>
            </div>
        `;

        total += plan.precio;
    }

    extras.forEach(extra => {
        const sel = usuario.extrasSeleccionados[extra.nombreInterno];
        if (!sel) return;

        cont.innerHTML += `
            <div class="carrito-item">
                <span>${extra.nombre}</span>
                <span>
                    ${extra.precio.toFixed(2)}€
                    <button class="btn-eliminar-item" onclick="eliminarItem('${extra.nombreInterno}')">X</button>
                </span>
            </div>
        `;

        total += extra.precio;
    });

    cont.innerHTML += `
        <div class="carrito-total">
            TOTAL: <strong>${total.toFixed(2)}€</strong>
        </div>
    `;
}

// ===============================
// ELIMINAR ITEM
// ===============================
function eliminarItem(nombreInterno) {
    if (nombreInterno === "plan") {
        usuario.planSeleccionado = null;
    } else {
        usuario.extrasSeleccionados[nombreInterno] = false;
    }

    renderPlanes();
    renderExtras();
    renderCarrito();
}

// ===============================
// PAYLOAD PARA STRIPE
// ===============================
function construirPayload() {
    const extrasPayload = [];

    extras.forEach(extra => {
        const sel = usuario.extrasSeleccionados[extra.nombreInterno];
        if (!sel) return;

        const payloadExtra = {
            nombre: extra.nombreInterno,
            cantidad: 1
        };

        if (extra.nombreInterno === "auto_subida_6h") {
            const hora = document.getElementById("horaInicioAutoSubida")?.value;
            if (!hora) {
                alert("Debes elegir una hora de inicio para la auto-subida.");
                throw new Error("Falta hora_inicio");
            }
           payloadExtra.fecha_inicio = hora;
        }

        extrasPayload.push(payloadExtra);
    });

    return {
        usuario_id: usuario.id,
        tipo: tipoActual,
        ref_id: ref_id,
        plan: usuario.planSeleccionado?.trim().toLowerCase() || "",
        extras: extrasPayload
    };
}

// ===============================
// BOTÓN PAGAR
// ===============================
document.getElementById("btnPagar").addEventListener("click", async () => {
    if (!usuario.planSeleccionado && !hayExtrasSeleccionados()) {
        alert("Selecciona un plan o algún extra antes de pagar.");
        return;
    }

    let payload;
    try {
        payload = construirPayload();
    } catch {
        return;
    }

    const res = await fetch("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.url) {
        window.location.href = data.url;
    } else {
        alert("Error al iniciar el pago");
    }
});

// ===============================
// UTILIDADES
// ===============================
function hayExtrasSeleccionados() {
    return Object.values(usuario.extrasSeleccionados).some(v => v === true);
}

// ===============================
// INIT
// ===============================
document.getElementById("btnCancelar").addEventListener("click", () => {
    const salir = confirm("¿Seguro que quieres salir?");
    if (salir) {
        window.location.href = "mi-cuenta.html";
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    await cargarUsuario();
    await cargarPlanes();
    await cargarExtrasActivos();
    await cargarExtras();
    renderCarrito();
});
