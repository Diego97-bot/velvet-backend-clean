const supabase = require("../config/supabase");
const { enviarEmail } = require("./email");

async function notificarExpirados() {
    const ahora = new Date();
    const en24h = new Date(ahora.getTime() + 24 * 60 * 60 * 1000).toISOString();

    console.log("🔍 Buscando expiraciones...");

    // ============================================================
    // 1. ANUNCIOS → aviso 24h antes (solo si NO se notificó antes)
    // ============================================================
    const { data: anuncios, error: errorAnuncios } = await supabase
        .from("anuncios")
        .select("id, usuario_id, plan_expira, notificado_expira")
        .lte("plan_expira", en24h)
        .eq("notificado_expira", false)
        .not("plan_expira", "is", null);

    if (errorAnuncios) console.error("❌ Error anuncios:", errorAnuncios);

    for (const anuncio of anuncios || []) {
        const emailUsuario = "diego90tui@gmail.com"; // temporal

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

        // Marcar como notificado
        await supabase
            .from("anuncios")
            .update({ notificado_expira: true })
            .eq("id", anuncio.id);

        console.log(`📨 Aviso enviado → anuncio ${anuncio.id}`);
    }

    // ============================================================
    // 2. HABITACIONES → aviso 24h antes (solo si NO se notificó)
    // ============================================================
    const { data: habitaciones, error: errorHabitaciones } = await supabase
        .from("habitaciones")
        .select("id, usuario_id, plan_expira, notificado_expira")
        .lte("plan_expira", en24h)
        .eq("notificado_expira", false)
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

        await supabase
            .from("habitaciones")
            .update({ notificado_expira: true })
            .eq("id", hab.id);

        console.log(`📨 Aviso enviado → habitación ${hab.id}`);
    }

    // ============================================================
    // 3. MEJORAS → aviso 24h antes (solo si NO se notificó)
    // ============================================================
    const { data: mejoras, error: errorMejoras } = await supabase
        .from("mejoras")
        .select("id, tipo, ref_id, fecha_expira, mejora_id, notificado_expira")
        .lte("fecha_expira", en24h)
        .eq("notificado_expira", false)
        .not("fecha_expira", "is", null);

    if (errorMejoras) console.error("❌ Error mejoras:", errorMejoras);

    for (const mejora of mejoras || []) {

        // Obtener nombre real de la mejora
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

        // Mejoras que NO deben enviar email
        const mejorasSinAviso = ["subida_24h", "verificado", "anuncio_extra"];
        if (mejorasSinAviso.includes(nombre)) {
            console.log(`⏭ Saltando mejora sin aviso: ${nombre}`);
            continue;
        }

        let mensaje = "";

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
            to: "diego90tui@gmail.com",
            subject: "Una mejora está por expirar",
            html: mensaje
        });

        // Marcar como notificado
        await supabase
            .from("mejoras")
            .update({ notificado_expira: true })
            .eq("id", mejora.id);

        console.log(`📨 Aviso enviado → mejora ${nombre} ref_id ${mejora.ref_id}`);
    }

    console.log("✨ Notificaciones completadas");
}

module.exports = { notificarExpirados };
