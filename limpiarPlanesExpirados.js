const supabase = require("./config/supabase");

async function limpiarPlanesExpirados() {
    console.log("⏳ Revisando planes y extras expirados...");

    const ahora = new Date().toISOString();

    // ===============================
    // 1. ANUNCIOS → bajar a FREE si expiró
    // ===============================
    const { data: anuncios } = await supabase
        .from("anuncios")
        .select("id, plan_expira")
        .lt("plan_expira", ahora);

    for (const anuncio of anuncios || []) {
        await supabase
            .from("anuncios")
            .update({
                plan_id: 1,          // FREE
                plan_expira: null
            })
            .eq("id", anuncio.id);

        console.log(`🔄 Anuncio ${anuncio.id} → FREE (plan expirado)`);
    }

    // ===============================
    // 2. HABITACIONES → bajar a FREE si expiró
    // ===============================
    const { data: habitaciones } = await supabase
        .from("habitaciones")
        .select("id, plan_expira")
        .lt("plan_expira", ahora);

    for (const hab of habitaciones || []) {
        await supabase
            .from("habitaciones")
            .update({
                plan_id: 1,          // FREE
                plan_expira: null
            })
            .eq("id", hab.id);

        console.log(`🔄 Habitación ${hab.id} → FREE (plan expirado)`);
    }

    // ===============================
    // 3. LIMPIAR EXTRAS EXPIRADOS
    // ===============================
    const { data: extras } = await supabase
        .from("mejoras")
        .select("id, ref_id, fecha_expira")
        .lt("fecha_expira", ahora);

    for (const extra of extras || []) {
        await supabase
            .from("mejoras")
            .delete()
            .eq("id", extra.id);

        console.log(`🧹 Extra ${extra.id} eliminado (ref_id: ${extra.ref_id})`);
    }

    console.log("✔ Limpieza completada");
}

module.exports = limpiarPlanesExpirados;
