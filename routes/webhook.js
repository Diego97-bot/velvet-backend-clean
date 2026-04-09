const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = require("../config/supabase");
const { enviarEmail } = require("../utils/email");
const { recalcularPrioridad } = require("../utils/recalcularPrioridad.js");
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

    console.log("📦 METADATA RECIBIDA:", session.metadata);

    const { usuario_id, tipo, ref_id, plan } = session.metadata;

    let extras = [];
    try {
        extras = JSON.parse(session.metadata.extras || "[]");
    } catch (e) {
        console.log("⚠️ No se pudieron parsear extras:", e.message);
    }

    console.log("📦 EXTRAS PARSEADOS:", extras);

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

        console.log("🔍 Buscando micropago:", nombreBuscado);

        const { data: microData } = await supabase
            .from("micropagos")
            .select("id")
            .eq("nombre", nombreBuscado)
            .single();

        console.log("📌 Micropago encontrado:", microData);

        micropago_id = microData?.id || null;
    }

    // ============================================================
    // 🟢 CASO ESPECIAL: SOLO anuncios_extra
    // ============================================================
    if (extras.length === 1 && extras[0].nombre === "anuncios_extra" && !plan) {
        console.log("🟢 Procesando anuncios_extra");

        const { data: usuarioData } = await supabase
            .from("usuarios")
            .select("anuncios_extra")
            .eq("id", usuario_id)
            .single();

        let actuales = usuarioData?.anuncios_extra || 0;
        let nuevos = Math.min(actuales + (extras[0].cantidad || 1), 3);

        console.log(`➕ Anuncios extra: ${actuales} → ${nuevos}`);

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
        console.log("🔍 Buscando plan:", plan);

        const { data } = await supabase
            .from("planes")
            .select("*")
            .eq("nombre", plan.trim().toLowerCase())
            .single();

        console.log("📌 Plan encontrado:", data);

        planInfo = data || null;
    }

    // ============================================================
    // 💾 GUARDAR PAGO
    // ============================================================
    console.log("💾 Guardando pago...");

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

        console.log(`🟣 Aplicando plan ${planInfo.nombre} hasta ${fechaExpira}`);

        await supabase
            .from(tabla)
            .update({
                plan_id: planInfo.id,
                plan_expira: fechaExpira,
                insignias: planInfo.insignias || null
            })
            .eq("id", ref_id);
        // 🔥 Recalcular prioridad por cambio de plan
        await recalcularPrioridad(ref_id, tipo);
    }

    // ============================================================
    // ⚡ PROCESAR EXTRAS
    // ============================================================
    const mejorasAInsertar = [];

    for (const extra of extras) {
        console.log("➡️ Procesando extra:", extra.nombre);

        const { data: extraInfo } = await supabase
            .from("micropagos")
            .select("*")
            .eq("nombre", extra.nombre)
            .single();

        console.log("📌 Extra info:", extraInfo);

        if (!extraInfo) {
            console.log("❌ Extra no encontrado en BD:", extra.nombre);
            continue;
        }

        const ahora = new Date();
        const ahoraISO = ahora.toISOString();

        switch (extraInfo.nombre) {

            case "subida_24h":
                console.log("⚡ Activando subida_24h");

                mejorasAInsertar.push({
                    tipo,
                    ref_id,
                    mejora_tipo: "extra",
                    mejora_id: extraInfo.id,
                    cantidad: extra.cantidad || 1,
                    fecha_inicio: ahoraISO,
                    fecha_expira: new Date(ahora.getTime() + 86400000).toISOString(),
                    ultima_subida: ahoraISO,
                    stripe_session_id: session.id,
                    activa: true
                });

                console.log("⬆ Subiendo anuncio arriba");

                await supabase
                    .from(tabla)
                    .update({ fecha_creado: ahoraISO })
                    .eq("id", ref_id);

                continue;

            case "auto_subida_2h":
                console.log("🔁 Activando auto_subida_2h");

                mejorasAInsertar.push({
                    tipo,
                    ref_id,
                    mejora_tipo: "extra",
                    mejora_id: extraInfo.id,
                    cantidad: extra.cantidad || 1,
                    fecha_inicio: ahoraISO,
                    fecha_expira: new Date(ahora.getTime() + 7 * 86400000).toISOString(),
                    ultima_subida: ahoraISO,
                    intervalo_horas: 2,
                    stripe_session_id: session.id,
                    activa: true
                });

                continue;

            case "boost_3dias":
                console.log("⚡ Activando boost_3dias");

                mejorasAInsertar.push({
                    tipo,
                    ref_id,
                    mejora_tipo: "extra",
                    mejora_id: extraInfo.id,
                    cantidad: extra.cantidad || 1,
                    fecha_inicio: ahoraISO,
                    fecha_expira: new Date(ahora.getTime() + 3 * 86400000).toISOString(),
                    stripe_session_id: session.id,
                    activa: true
                });

                continue;

            case "verificado":
                console.log("🟧 Activando verificado");

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

            default:
                console.log("❌ Extra no reconocido en switch:", extraInfo.nombre);
        }
    }

    if (mejorasAInsertar.length) {
        console.log("💾 Insertando mejoras:", mejorasAInsertar);
        await supabase.from("mejoras").insert(mejorasAInsertar);
        await recalcularPrioridad(ref_id, tipo);
    } else {
        console.log("⚠️ No hay mejoras para insertar");
    }

    console.log("✨ FIN WEBHOOK");
    await enviarEmail({
        to: "diego90@gmail.com",
        subject: "Compra confirmada",
        html: `
        <p>Hola,</p>
        <p>Tu compra se ha procesado correctamente. Ya puedes disfrutar de las ventajas del plan adquirido.</p>
        <p>Gracias por apoyar Velvet.</p>
    `
    });


    res.json({ received: true });
});

module.exports = router;
