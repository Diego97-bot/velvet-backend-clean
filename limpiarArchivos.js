const supabase = require("./config/supabase");

async function limpiarArchivosHuérfanos() {
    console.log("🧹 Revisando archivos huérfanos...");

    // ===============================
    // 1. Obtener rutas válidas desde BD
    // ===============================

    const rutasValidas = new Set();

    // Fotos de anuncios
    const { data: fotosAnuncios } = await supabase
        .from("fotos")
        .select("url");

    fotosAnuncios?.forEach(f => rutasValidas.add(f.url));

    // Fotos de habitaciones
    const { data: fotosHab } = await supabase
        .from("fotos_habitaciones")
        .select("url");

    fotosHab?.forEach(f => rutasValidas.add(f.url));

    // Videos y audios de anuncios
    const { data: anuncios } = await supabase
        .from("anuncios")
        .select("video_ruta, audio_ruta");

    anuncios?.forEach(a => {
        if (a.video_ruta) rutasValidas.add(a.video_ruta);
        if (a.audio_ruta) rutasValidas.add(a.audio_ruta);
    });

    // Videos y audios de habitaciones
    const { data: habitaciones } = await supabase
        .from("habitaciones")
        .select("video_ruta, audio_ruta");

    habitaciones?.forEach(h => {
        if (h.video_ruta) rutasValidas.add(h.video_ruta);
        if (h.audio_ruta) rutasValidas.add(h.audio_ruta);
    });

    // ===============================
    // 2. Leer archivos reales del bucket
    // ===============================

    const buckets = ["fotos", "habitaciones", "video", "audio"];

    for (const bucket of buckets) {
        const { data: archivos } = await supabase.storage
            .from(bucket)
            .list("", { recursive: true });

        if (!archivos) continue;

        for (const archivo of archivos) {
            const rutaCompleta = `${bucket}/${archivo.name}`;

            // Si NO está en BD → borrar
            if (!rutasValidas.has(rutaCompleta)) {
                console.log(`🗑 Borrando archivo huérfano: ${rutaCompleta}`);

                await supabase.storage
                    .from(bucket)
                    .remove([archivo.name]);
            }
        }
    }

    console.log("✔ Limpieza de archivos completada");

    // ===============================
    // 3. LIMPIAR CARPETAS VACÍAS
    // ===============================
    for (const bucket of buckets) {
        const { data: items } = await supabase.storage
            .from(bucket)
            .list("", { recursive: true });

        if (!items) continue;

        // Detectar carpetas (Supabase marca carpetas con "metadata: null")
        const carpetas = items.filter(i => i.metadata === null);

        for (const carpeta of carpetas) {
            const ruta = carpeta.name;

            const { data: contenido } = await supabase.storage
                .from(bucket)
                .list(ruta);

            if (!contenido || contenido.length === 0) {
                console.log(`🗑 Eliminando carpeta vacía: ${bucket}/${ruta}`);

                // Supabase solo borra carpetas si se pasa sin "/"
                await supabase.storage
                    .from(bucket)
                    .remove([ruta.replace(/\/$/, "")]);
            }
        }
    }
}

module.exports = limpiarArchivosHuérfanos;
