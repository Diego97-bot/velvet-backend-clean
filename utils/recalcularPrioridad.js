async function recalcularPrioridad(ref_id, tipo) {
    const tabla = tipo === "anuncio" ? "anuncios" : "habitaciones";

    // 1. Leer anuncio
    const { data: anuncio } = await supabase
        .from(tabla)
        .select("*")
        .eq("id", ref_id)
        .single();

    if (!anuncio) return;

    // 2. Leer plan del usuario
    const { data: usuario } = await supabase
        .from("usuarios")
        .select("plan, plan_expira")
        .eq("id", anuncio.usuario_id)
        .single();

    let prioridad_usuario = 1; // Free por defecto

    if (usuario.plan === "VIP" && new Date() < new Date(usuario.plan_expira)) {
        prioridad_usuario = 3;
    } else if (usuario.plan === "Premium" && new Date() < new Date(usuario.plan_expira)) {
        prioridad_usuario = 2;
    }

    // 3. Leer mejoras activas
    const { data: mejoras } = await supabase
        .from("mejoras")
        .select("*")
        .eq("ref_id", ref_id)
        .eq("tipo", tipo)
        .eq("activa", true);

    let tiene24h = false;
    let tieneBoost = false;
    let tieneAutosubida = false;

    mejoras.forEach(m => {
        if (m.mejora_id === 101) tiene24h = true;
        if (m.mejora_id === 102) tieneBoost = true;
        if (m.mejora_id === 103) tieneAutosubida = true;
    });

    // 4. Calcular prioridad_mejoras
    let prioridad_mejoras = 0;

    if (tiene24h && tieneBoost && tieneAutosubida) prioridad_mejoras = 6;
    else if (tiene24h && tieneBoost) prioridad_mejoras = 5;
    else if (tiene24h) prioridad_mejoras = 4;
    else if (tieneBoost && tieneAutosubida) prioridad_mejoras = 3;
    else if (tieneBoost) prioridad_mejoras = 2;
    else if (tieneAutosubida) prioridad_mejoras = 1;

    // 5. Calcular prioridad_total
    const nueva_prioridad_total = prioridad_usuario * 10 + prioridad_mejoras;

    // 6. Comparar con la prioridad actual
    const prioridad_actual = anuncio.prioridad_total;

    let nueva_fecha_creado = anuncio.fecha_creado;

    if (nueva_prioridad_total > prioridad_actual) {
        // SUBE → subir anuncio
        nueva_fecha_creado = new Date().toISOString();
    } else if (nueva_prioridad_total < prioridad_actual) {
        // BAJA → restaurar fecha_original
        nueva_fecha_creado = anuncio.fecha_original;
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