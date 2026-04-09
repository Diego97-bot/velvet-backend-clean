const supabase = require("../config/supabase");
const { enviarEmail } = require("./email");

async function notificarExpirados() {
    const ahora = new Date();
    const en24h = new Date(ahora.getTime() + 24 * 60 * 60 * 1000).toISOString();

    console.log("🔍 Buscando expiraciones...");

    // ---------------------------------------------------------
    // 1. ANUNCIOS cuyo plan expira en 24h
    // ---------------------------------------------------------
    const { data: anuncios, error: errorAnuncios } = await supabase
        .from("anuncios")
        .select("id, usuario_id, plan_expira")
        .lte("plan_expira", en24h)
        .not("plan_expira", "is", null);

    if (errorAnuncios) console.error("❌ Error anuncios:", errorAnuncios);

    for (const anuncio of anuncios || []) {
        const emailUsuario = "test@email.com"; // temporal

        await enviarEmail({
            to: emailUsuario,
            subject: "El plan de tu anuncio está por expirar",
            html: `
                <p>Hola,</p>
                <p>El plan de tu anuncio está a punto de expirar. Seguirá visible, pero perderá prioridad frente a anuncios con plan activo.</p>
                <p>Puedes renovarlo desde tu panel.</p>
                <p>Gracias por usar Velvet.</p>
            `
        });

        console.log(`📨 Aviso enviado → anuncio ${anuncio.id}`);
    }

    // ---------------------------------------------------------
    // 2. HABITACIONES cuyo plan expira en 24h
    // ---------------------------------------------------------
    const { data: habitaciones, error: errorHabitaciones } = await supabase
        .from("habitaciones")
        .select("id, usuario_id, plan_expira")
        .lte("plan_expira", en24h)
        .not("plan_expira", "is", null);

    if (errorHabitaciones) console.error("❌ Error habitaciones:", errorHabitaciones);

    for (const hab of habitaciones || []) {
        const emailUsuario = "diego90tui@gmail.com"; // temporal

        await enviarEmail({
            to: emailUsuario,
            subject: "El plan de tu habitación está por expirar",
            html: `
                <p>Hola,</p>
                <p>El plan de tu habitación está a punto de expirar. Seguirá visible, pero perderá prioridad frente a habitaciones con plan activo.</p>
                <p>Puedes renovarlo desde tu panel.</p>
                <p>Gracias por usar Velvet.</p>
            `
        });

        console.log(`📨 Aviso enviado → habitación ${hab.id}`);
    }

    // ---------------------------------------------------------
    // 3. MEJORAS (común) que expiran en 24h
    // ---------------------------------------------------------
    const { data: mejoras, error: errorMejoras } = await supabase
        .from("mejoras")
        .select("id, tipo, ref_id, fecha_expira, mejora_id")
        .lte("fecha_expira", en24h)
        .not("fecha_expira", "is", null);

    if (errorMejoras) console.error("❌ Error mejoras:", errorMejoras);

    for (const mejora of mejoras || []) {

        // Obtener el nombre real de la mejora desde micropagos
        const { data: micropago, error: errorMicropago } = await supabase
            .from("micropagos")
            .select("nombre")
            .eq("id", mejora.mejora_id)
            .single();

        if (errorMicropago) {
            console.error("❌ Error micropago:", errorMicropago);
            continue;
        }

        const nombre = micropago?.nombre || "mejora";
        const emailUsuario = "diego90tui@gmail.com"; // temporal
        let mensaje = "";

        // -----------------------------------------
        // MENSAJES SEGÚN EL CATÁLOGO REAL
        // -----------------------------------------
        if (nombre === "boost_3dias") {
            mensaje = `
                <p>Hola,</p>
                <p>El boost de tu publicación está a punto de expirar. Seguirá visible, pero ya no estará destacada.</p>
                <p>Puedes renovarlo desde tu panel.</p>
                <p>Gracias por usar Velvet.</p>
            `;
        }

        else if (nombre === "auto_subida_2h") {
            mensaje = `
                <p>Hola,</p>
                <p>Las auto-subidas de tu publicación están a punto de expirar. Dejará de subir automáticamente a primeras posiciones.</p>
                <p>Puedes renovarlas desde tu panel.</p>
                <p>Gracias por usar Velvet.</p>
            `;
        }

   
        await enviarEmail({
            to: emailUsuario,
            subject: "Una mejora está por expirar",
            html: mensaje
        });

        console.log(`📨 Aviso enviado → mejora ${nombre} ref_id ${mejora.ref_id}`);
    }

    console.log("✨ Notificaciones completadas");
}

module.exports = { notificarExpirados };
