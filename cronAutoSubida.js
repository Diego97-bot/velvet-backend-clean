const cron = require("node-cron");
const supabase = require("./config/supabase");

async function ejecutarAutoSubidas() {
    console.log("⏳ Ejecutando cron de auto-subidas...");

    // Leer mejoras activas de auto-subida (mejora_id = 103)
    const { data: mejoras, error } = await supabase
        .from("mejoras")
        .select("*")
        .eq("mejora_id", 103)
        .eq("activa", true);

    if (error) {
        console.error("❌ Error leyendo mejoras:", error);
        return;
    }

    const ahora = Date.now();

    for (const m of mejoras) {
        const fechaInicio = new Date(m.fecha_inicio).getTime();
        const fechaFin = new Date(m.fecha_fin).getTime();

        // Si la mejora expiró → desactivarla
        if (ahora > fechaFin) {
            await supabase
                .from("mejoras")
                .update({ activa: false })
                .eq("id", m.id);

            console.log(`⚠ Mejora ${m.id} expirada y desactivada`);
            continue;
        }

        const ultima = m.ultima_subida
            ? new Date(m.ultima_subida).getTime()
            : fechaInicio;

        const intervaloMs = m.intervalo_horas * 60 * 60 * 1000;

        // ¿Han pasado X horas?
        if (ahora - ultima >= intervaloMs) {
            console.log(`⬆ Auto-subida → ${m.tipo} ${m.ref_id}`);

            const tabla = m.tipo === "anuncio" ? "anuncios" : "habitaciones";

            // Subir el anuncio en el orden
            const { error: err1 } = await supabase
                .from(tabla)
                .update({ fecha_creado: new Date().toISOString() })
                .eq("id", m.ref_id);

            if (err1) {
                console.error(`❌ Error subiendo ${m.tipo} ${m.ref_id}:`, err1);
                continue;
            }

            // Registrar la última subida
            const { error: err2 } = await supabase
                .from("mejoras")
                .update({ ultima_subida: new Date().toISOString() })
                .eq("id", m.id);

            if (err2) {
                console.error(`❌ Error actualizando ultima_subida:`, err2);
                continue;
            }

            console.log(`✨ Auto-subida aplicada a ${m.tipo} ${m.ref_id}`);
        }
    }
}

// Ejecutar cada 5 minutos
cron.schedule("*/5 * * * *", ejecutarAutoSubidas);

console.log("🚀 Cron de auto-subidas iniciado");
