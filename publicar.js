document.getElementById("btn-siguiente").addEventListener("click", async () => {
    const categoria = document.getElementById("select-categoria").value;

    if (!categoria) {
        alert("Selecciona una categoría");
        return;
    }

    // 1. Comprobar límite de publicaciones
    const puedePublicar = await comprobarLimitePublicaciones();
    if (!puedePublicar) {
        alert("Has alcanzado el límite de 5 publicaciones en total (anuncios + habitaciones).");
        return;
    }

    // 2. Redirigir según categoría
    if (categoria === "habitacion") {
        window.location.href = "publicar-habitacion.html?categoria=" + encodeURIComponent(categoria);
    } else {
        window.location.href = "publicar-normal.html?categoria=" + encodeURIComponent(categoria);
    }
});


// ===============================
// FUNCIÓN PARA CONSULTAR AL BACKEND
// ===============================
async function comprobarLimitePublicaciones() {
    try {
const res = await fetch("http://localhost:3000/auth/mi-perfil/count", {
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
});


        const data = await res.json();

        if (!data.ok) return false;

        // total = anuncios + habitaciones
       return data.total < data.limite;

    } catch (err) {
        console.error("Error comprobando límite:", err);
        return false;
    }
}
