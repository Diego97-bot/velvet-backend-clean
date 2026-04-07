const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = require("../config/supabase");
const { enviarEmail } = require("../utils/email");

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
    console.log("\n==============================");
    console.log("🔥 WEBHOOK RECIBIDO");
    console.log("==============================");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
        console.log("🔐 Verificando firma...");
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log("✅ Firma verificada");
    } catch (err) {
        console.error("❌ Error verificando webhook:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type !== "checkout.session.completed") {
        console.log("⚠️ Evento ignorado:", event.type);
        return res.json({ received: true });
    }

    const session = event.data.object;
    const { usuario_id, tipo, ref_id, plan } = session.metadata;

    let extras = [];
    try {
        extras = JSON.parse(session.metadata.extras || "[]");
    } catch {}

    const cantidadPagada = session.amount_total / 100;
    const tabla = tipo === "anuncio" ? "anuncios" : "habitaciones";

    // ============================================================
    // 🔎 BUSCAR MICROPAGO_ID
    // ============================================================
    let micropago_id = null;

    if (extras.length === 1 && extras[0]?.nombre) {
        const nombreBuscado =
            extras[0].nombre === "anuncios_extra"
                ? "anuncio_extra"
                : extras[0].nombre;

        const { data: microData } = await supabase
            .from("micropagos")
            .select("id")
            .eq("nombre", nombreBuscado)
            .single();

        micropago_id = microData?.id || null;
    }

    // ============================================================
    // 🟢 CASO ESPECIAL: SOLO anuncios_extra
    // ============================================================
    if (extras.length === 1 && extras[0].nombre === "anuncios_extra" && !plan) {
        const { data: usuarioData } = await supabase
            .from("usuarios")
            .select("anuncios_extra")
            .eq("id", usuario_id)
            .single();

        let actuales = usuarioData?.anuncios_extra || 0;
        let nuevos = Math.min(actuales + (extras[0].cantidad || 1), 3);

        await supabase
            .from("usuarios")
            .update({ anuncios_extra: nuevos })
            .eq("id", usuario_id);

        await supabase.from("pagos").insert({
            usuario_id,
            tipo: "extra",
            anuncio_id: null,
            plan_id: null,
            micropago_id,
            cantidad: cantidadPagada,
            estado: "pagado",
            referencia: session.id,
            fecha: new Date().toISOString()
        });

        return res.json({ received: true });
    }

    // ============================================================
    // 🔎 OBTENER PLAN
    // ============================================================
    let planInfo = null;

    if (plan) {
        const { data } = await supabase
            .from("planes")
            .select("*")
            .eq("nombre", plan.trim().toLowerCase())
            .single();

        planInfo = data || null;
    }

    // ============================================================
    // 💾 GUARDAR PAGO
    // ============================================================
    await supabase.from("pagos").insert({
        usuario_id,
        anuncio_id: tipo === "anuncio" ? ref_id : null,
        tipo,
        plan_id: planInfo?.id || null,
        micropago_id,
        cantidad: cantidadPagada,
        estado: "pagado",
        referencia: session.id,
        fecha: new Date().toISOString()
    });

    // ============================================================
    // 🟣 APLICAR PLAN
    // ============================================================
    if (planInfo && ref_id) {
        const fechaExpira = new Date(Date.now() + planInfo.duracion_dias * 86400000).toISOString();

        await supabase
            .from(tabla)
            .update({
                plan_id: planInfo.id,
                plan_expira: fechaExpira,
                insignias: planInfo.insignias || null
            })
            .eq("id", ref_id);
    }

    // ============================================================
    // ⚡ PROCESAR EXTRAS
    // ============================================================
    const mejorasAInsertar = [];

    for (const extra of extras) {
        if (!extra?.nombre || extra.nombre === "anuncios_extra") continue;

        const { data: extraInfo } = await supabase
            .from("micropagos")
            .select("*")
            .eq("nombre", extra.nombre)
            .single();

        if (!extraInfo) continue;

        const ahora = new Date();
        const ahoraISO = ahora.toISOString();

        switch (extraInfo.nombre) {

            case "subida_24h":
                mejorasAInsertar.push({
                    tipo,
                    ref_id,
                    mejora_tipo: "extra",
                    mejora_id: extraInfo.id,
                    cantidad: extra.cantidad || 1,
                    fecha_inicio: ahoraISO,
                    fecha_expira: new Date(ahora.getTime() + 86400000).toISOString(),
                    ultima_subida: ahoraISO,
                    stripe_session_id: session.id
                });

                // SUBIR ARRIBA
                await supabase
                    .from(tabla)
                    .update({ fecha_creado: ahoraISO })
                    .eq("id", ref_id);

                continue;

            case "auto_subida_6h":
                mejorasAInsertar.push({
                    tipo,
                    ref_id,
                    mejora_tipo: "extra",
                    mejora_id: extraInfo.id,
                    cantidad: extra.cantidad || 1,
                    fecha_inicio: ahoraISO,
                    fecha_expira: new Date(ahora.getTime() + 7 * 86400000).toISOString(),
                    ultima_subida: ahoraISO,
                    intervalo_horas: 6,
                    stripe_session_id: session.id
                });

                continue;

            case "boost_3dias":
                mejorasAInsertar.push({
                    tipo,
                    ref_id,
                    mejora_tipo: "extra",
                    mejora_id: extraInfo.id,
                    cantidad: extra.cantidad || 1,
                    fecha_inicio: ahoraISO,
                    fecha_expira: new Date(ahora.getTime() + 3 * 86400000).toISOString(),
                    stripe_session_id: session.id
                });

                continue;

            case "verificado":
                await supabase
                    .from(tabla)
                    .update({ verificado: true })
                    .eq("id", ref_id);

                mejorasAInsertar.push({
                    tipo,
                    ref_id,
                    mejora_tipo: "extra",
                    mejora_id: extraInfo.id,
                    cantidad: extra.cantidad || 1,
                    fecha_expira: null,
                    stripe_session_id: session.id
                });

                continue;
        }
    }

    if (mejorasAInsertar.length) {
        await supabase.from("mejoras").insert(mejorasAInsertar);
    }

    console.log("✨ FIN WEBHOOK");
    res.json({ received: true });
});

module.exports = router;
