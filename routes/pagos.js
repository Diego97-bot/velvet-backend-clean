const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.get("/:usuario_id", async (req, res) => {
    const usuario_id = parseInt(req.params.usuario_id);

    // Parámetros de paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        // 1. Contar total de pagos
        const { count } = await supabase
            .from("pagos")
            .select("*", { count: "exact", head: true })
            .eq("usuario_id", usuario_id);

        // 2. Obtener pagos paginados
        const { data: pagos, error } = await supabase
            .from("pagos")
            .select(`
                id,
                tipo,
                cantidad,
                estado,
                referencia,
                fecha,
                plan_id,
                planes (nombre, titulo)
            `)
            .eq("usuario_id", usuario_id)
            .order("fecha", { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("❌ Error obteniendo pagos:", error);
            return res.status(500).json({ error: "Error obteniendo pagos" });
        }

        const pagosConDesglose = [];

        for (const pago of pagos) {
            // Obtener mejoras asociadas
            const { data: mejoras } = await supabase
                .from("mejoras")
                .select(`
                    mejora_id,
                    cantidad,
                    fecha_expira,
                    micropagos (nombre, nombre_front)
                `)
                .eq("stripe_session_id", pago.referencia);

            const extras = mejoras?.map(m => ({
                id: m.mejora_id,
                nombre: m.micropagos?.nombre_front || m.micropagos?.nombre,
                cantidad: m.cantidad,
                fecha_expira: m.fecha_expira
            })) || [];

            const plan = pago.plan_id
                ? { id: pago.plan_id, nombre: pago.planes?.titulo || pago.planes?.nombre }
                : null;

            pagosConDesglose.push({
                ...pago,
                plan,
                extras
            });
        }

        res.json({
            page,
            limit,
            total: count,
            total_pages: Math.ceil(count / limit),
            data: pagosConDesglose
        });

    } catch (err) {
        console.error("❌ Error en historial:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


module.exports = router;
