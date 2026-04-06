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

    console.log("📨 Tipo de evento:", event.type);

    if (event.type !== "checkout.session.completed") {
        console.log("⚠️ Evento ignorado:", event.type);
        return res.json({ received: true });
    }

    const session = event.data.object;

    console.log("💰 Pago confirmado:", session.id);
    console.log("📦 Metadata recibida:", session.metadata);

    if (!session.metadata) {
        console.log("⚠️ Evento sin metadata");
        return res.json({ received: true });
    }

    const { usuario_id, tipo, ref_id, plan } = session.metadata;

    let extras = [];
    try {
        extras = JSON.parse(session.metadata.extras || "[]");
        console.log("📦 Extras parseados:", extras);
    } catch (err) {
        console.error("❌ Error parseando extras:", err);
    }

    const cantidadPagada = session.amount_total / 100;
    console.log("💶 Cantidad pagada:", cantidadPagada);

    const tabla = tipo === "anuncio" ? "anuncios" : "habitaciones";
    console.log("📄 Tabla objetivo:", tabla);

    // ============================================================
    // 🔎 BUSCAR MICROPAGO_ID SIEMPRE (INCLUIDO anuncios_extra)
    // ============================================================

    let micropago_id = null;

    if (extras.length === 1 && extras[0]?.nombre) {

        const nombreBuscado =
            extras[0].nombre === "anuncios_extra"
                ? "anuncio_extra"   // ← NOMBRE REAL
                : extras[0].nombre;

        const { data: microData, error: microError } = await supabase
            .from("micropagos")
            .select("id")
            .eq("nombre", nombreBuscado)
            .single();

        console.log("📌 micropago buscado:", nombreBuscado, "→", microData, microError);

        micropago_id = microData?.id || null;
    }

    // ============================================================
    // 🟢 CASO ESPECIAL: SOLO ANUNCIOS EXTRA
    // ============================================================
    if (extras.length === 1 && extras[0].nombre === "anuncios_extra" && !plan) {
        console.log("🟢 Caso: SOLO anuncios extra");

        try {
            console.log("🔎 Obteniendo usuario...");
            const { data: usuarioData, error } = await supabase
                .from("usuarios")
                .select("anuncios_extra")
                .eq("id", usuario_id)
                .single();

            console.log("📌 usuarioData:", usuarioData, "error:", error);

            let actuales = usuarioData?.anuncios_extra || 0;
            let nuevos = Math.min(actuales + (extras[0].cantidad || 1), 3);

            console.log(`🎉 Actualizando anuncios_extra: ${actuales} → ${nuevos}`);

            const { error: updError } = await supabase
                .from("usuarios")
                .update({ anuncios_extra: nuevos })
                .eq("id", usuario_id);

            console.log("📌 Resultado update usuario:", updError);

            console.log("🧾 Insertando pago...");

            const { data: pagoData, error: pagoError } = await supabase
                .from("pagos")
                .insert({
                    usuario_id,
                    tipo: "extra",
                    anuncio_id: null,
                    plan_id: null,
                    micropago_id,
                    cantidad: cantidadPagada,
                    estado: "pagado",
                    referencia: session.id,
                    fecha: new Date().toISOString()
                })
                .select();

            console.log("📌 pagoData:", pagoData, "error:", pagoError);

        } catch (err) {
            console.error("❌ ERROR EN BLOQUE anuncios_extra:", err);
        }

        console.log("✨ FIN anuncios_extra");
        return res.json({ received: true });
    }

    // ============================================================
    // 🔎 OBTENER PLAN (NORMALIZADO)
    // ============================================================
    console.log("🔎 Buscando plan:", plan);

    let planInfo = null;

    // Normalizar el nombre del plan
    const planNormalizado = plan?.trim().toLowerCase() || null;

    if (planNormalizado) {
        const { data, error } = await supabase
            .from("planes")
            .select("*")
            .eq("nombre", planNormalizado)
            .single();

        console.log("📌 planInfo:", data, "error:", error);

        if (!error && data) planInfo = data;
    }


    // ============================================================
    // 💾 GUARDAR PAGO (SIEMPRE)
    // ============================================================
    console.log("🧾 Insertando pago...");

    const { data: pagoData, error: pagoError } = await supabase
        .from("pagos")
        .insert({
            usuario_id,
            anuncio_id: tipo === "anuncio" ? ref_id : null,
            tipo,
            plan_id: planInfo?.id || null,
            micropago_id,
            cantidad: cantidadPagada,
            estado: "pagado",
            referencia: session.id,
            fecha: new Date().toISOString()
        })
        .select();

    console.log("📌 pagoData:", pagoData);
    console.log("❌ pagoError:", pagoError);
    // ============================================================
    // 🟣 ACTUALIZAR ANUNCIO/HABITACIÓN CON EL PLAN
    // ============================================================
    if (planInfo && ref_id) {
        console.log("🏷️ Aplicando plan al anuncio/habitación...");

        const fechaExpira = new Date(Date.now() + planInfo.duracion_dias * 86400000).toISOString();

        const { error: updPlanError } = await supabase
            .from(tabla)
            .update({
                plan_id: planInfo.id,
                plan_expira: fechaExpira,
                insignias: planInfo.insignias || null
            })
            .eq("id", ref_id);

        console.log("📌 Resultado actualización plan:", updPlanError);
    }


    if (pagoError) {
        console.error("❌ ERROR INSERTANDO PAGO:", pagoError);
    }
    // Obtener email del usuario
    const { data: usuarioInfo } = await supabase
        .from("usuarios")
        .select("email, nombre")
        .eq("id", usuario_id)
        .single();

    const usuarioEmail = usuarioInfo?.email;
    const usuarioNombre = usuarioInfo?.nombre || "usuario";

    if (usuarioEmail) {
        const concepto = plan
            ? `Plan: ${plan}`
            : (extras[0]?.nombre || tipo);

        await enviarEmail({
            to: usuarioEmail,
            subject: "Pago recibido",
            html: `
            <div style="font-family:Arial;padding:20px;background:#f7f7f7">
              <div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:8px">
                <h2 style="color:#333">Gracias por tu compra</h2>
                <p>Hola ${usuarioNombre},</p>
                <p>Hemos recibido tu pago correctamente.</p>

                <div style="background:#fafafa;padding:15px;border-radius:6px;margin:20px 0">
                  <p><strong>Concepto:</strong> ${concepto}</p>
                  <p><strong>Importe:</strong> ${cantidadPagada}€</p>
                  <p><strong>Referencia:</strong> ${session.id}</p>
                </div>

                <p>Puedes ver tu historial de pagos en tu panel de usuario.</p>

                <p style="margin-top:30px;color:#777;font-size:12px">
                  Este es un email automático, por favor no respondas a este mensaje.
                </p>
              </div>
            </div>
        `
        });
    }


    // ============================================================
    // ⚡ PROCESAR EXTRAS REALES
    // ============================================================
    console.log("⚡ Procesando extras...");

    const mejorasAInsertar = [];

    for (const extra of extras) {
        console.log("➡️ Extra:", extra);

        if (!extra?.nombre || extra.nombre === "anuncios_extra") {
            console.log("⏭ Extra ignorado");
            continue;
        }

        const { data: extraInfo, error } = await supabase
            .from("micropagos")
            .select("*")
            .eq("nombre", extra.nombre)
            .single();

        console.log("📌 extraInfo:", extraInfo, "error:", error);

        if (!extraInfo) continue;

        let fecha_expira = null;

        switch (extraInfo.nombre) {
            case "subida_24h":
                fecha_expira = new Date(Date.now() + 86400000).toISOString();
                break;

            case "boost_3dias":
                fecha_expira = new Date(Date.now() + 3 * 86400000).toISOString();
                break;

            case "verificado":
                console.log("🏅 Activando verificado...");
                const { error: verErr } = await supabase
                    .from(tabla)
                    .update({ verificado: true })
                    .eq("id", ref_id);
                console.log("📌 verificado error:", verErr);

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


            case "auto_subida_6h":
                console.log("⏰ Procesando auto_subida_6h...");

                if (!extra.fecha_inicio) {
                    console.error("❌ falta fecha_inicio");
                    continue;
                }

                const fecha_inicio = new Date(
                    `${new Date().toISOString().split("T")[0]}T${extra.fecha_inicio}:00`
                );

                mejorasAInsertar.push({
                    tipo,
                    ref_id,
                    mejora_tipo: "extra",
                    mejora_id: extraInfo.id,
                    cantidad: extra.cantidad || 1,
                    fecha_expira: new Date(fecha_inicio.getTime() + 7 * 86400000).toISOString(),
                    stripe_session_id: session.id,
                    fecha_inicio: fecha_inicio.toISOString(),
                    intervalo_horas: 6
                });

                continue;
        }

        mejorasAInsertar.push({
            tipo,
            ref_id,
            mejora_tipo: "extra",
            mejora_id: extraInfo.id,
            cantidad: extra.cantidad || 1,
            fecha_expira,
            stripe_session_id: session.id
        });
    }

    console.log("📦 mejorasAInsertar:", mejorasAInsertar);

    if (mejorasAInsertar.length) {
        const { data, error } = await supabase
            .from("mejoras")
            .insert(mejorasAInsertar)
            .select();

        console.log("📌 mejoras insertadas:", data);
        console.log("❌ mejoras error:", error);
    }

    console.log("✨ FIN WEBHOOK");
    res.json({ received: true });
});

module.exports = router;
