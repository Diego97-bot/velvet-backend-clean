const supabase = require("../config/supabase");

async function recalcularPrioridad(ref_id, tipo) {
    const tabla = tipo === "anuncio" ? "anuncios" : "habitaciones";

    // 1. Leer anuncio/habitación
    const { data: item } = await supabase
        .from(tabla)
        .select("id, plan_id, plan_expira, fecha_original, fecha_creado, prioridad_total")
        .eq("id", ref_id)
        .single();

    if (!item) return;

    const ahora = new Date();

    // 2. PRIORIDAD USUARIO (pero va por anuncio)
    let prioridad_usuario = 1; // FREE

    if (item.plan_id === 3 && new Date(item.plan_expira) > ahora) {
        prioridad_usuario = 3; // VIP
    } else if (item.plan_id === 2 && new Date(item.plan_expira) > ahora) {
        prioridad_usuario = 2; // Premium
    }

    // 3. Leer mejoras activas
    const { data: mejoras } = await supabase
        .from("mejoras")
        .select("mejora_id")
        .eq("ref_id", ref_id)
        .eq("tipo", tipo)
        .eq("activa", true);

    let tiene24h = mejoras.some(m => m.mejora_id === 101);
    let tieneBoost = mejoras.some(m => m.mejora_id === 104);
    let tieneAutosubida = mejoras.some(m => m.mejora_id === 103);

    // 4. PRIORIDAD MEJORAS
    let prioridad_mejoras = 0;

    if (tiene24h && tieneBoost && tieneAutosubida) prioridad_mejoras = 6;
    else if (tiene24h && tieneBoost) prioridad_mejoras = 5;
    else if (tiene24h) prioridad_mejoras = 4;
    else if (tieneBoost && tieneAutosubida) prioridad_mejoras = 3;
    else if (tieneBoost) prioridad_mejoras = 2;
    else if (tieneAutosubida) prioridad_mejoras = 1;

    // 5. PRIORIDAD TOTAL
    const nueva_prioridad_total = prioridad_usuario * 10 + prioridad_mejoras;

    // 6. Ajustar fecha_creado
    let nueva_fecha_creado = item.fecha_creado;

    if (nueva_prioridad_total > item.prioridad_total) {
        // SUBE
        nueva_fecha_creado = new Date().toISOString();
    } else if (nueva_prioridad_total < item.prioridad_total) {
        // BAJA
        nueva_fecha_creado = item.fecha_original;
    }

    // 7. Guardar cambios
    await supabase
        .from(tabla)
        .update({
            prioridad_usuario,
            prioridad_mejoras,
            prioridad_total: nueva_prioridad_total,
            fecha_creado: nueva_fecha_creado
        })
        .eq("id", ref_id);
}

module.exports = { recalcularPrioridad };
