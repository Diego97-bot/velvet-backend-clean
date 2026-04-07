const cron = require("node-cron");
const supabase = require("./config/supabase");

async function ejecutarAutoSubidas() {
    console.log("⏳ Ejecutando cron de auto-subidas...");

    // Leer mejoras activas con auto_subida_6h (mejora_id = 3)
    const { data: mejoras, error } = await supabase
        .from("mejoras")
        .select("*")
        .eq("mejora_id", 103);

    if (error) {
        console.error("❌ Error leyendo mejoras:", error);
        return;
    }

    const ahora = Date.now();

    for (const m of mejoras) {
        const fechaInicio = new Date(m.fecha_inicio).getTime();
        const ultima = m.ultima_subida
            ? new Date(m.ultima_subida).getTime()
            : fechaInicio;

        const intervaloMs = m.intervalo_horas * 60 * 60 * 1000;

        // ¿Han pasado 6 horas?
        if (ahora - ultima >= intervaloMs) {
            console.log(`⬆ Subiendo ${m.tipo} ${m.ref_id}`);

            const tabla = m.tipo === "anuncio" ? "anuncios" : "habitaciones";

            // Actualizar fecha_creado para subirlo en el orden
            await supabase
                .from(tabla)
                .update({ fecha_creado: new Date().toISOString() })
                .eq("id", m.ref_id);

            // Actualizar ultima_subida
            await supabase
                .from("mejoras")
                .update({ ultima_subida: new Date().toISOString() })
                .eq("id", m.id);

            console.log(`✨ Auto-subida aplicada a ${m.tipo} ${m.ref_id}`);
        }
    }
}

// Ejecutar cada 5 minutos
cron.schedule("*/5 * * * *", ejecutarAutoSubidas);

console.log("🚀 Cron de auto-subidas iniciado");
