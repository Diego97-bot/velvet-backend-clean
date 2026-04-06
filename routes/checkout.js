const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ======================================================
// =============== CHECKOUT (CREAR SESIÓN) ===============
// ======================================================
router.post("/", async (req, res) => {
    try {
        const { usuario_id, tipo, ref_id, plan, extras } = req.body;

        console.log("PAYLOAD RECIBIDO:", req.body);

        const line_items = [];

        // ===============================
        // PLANES
        // ===============================
        const planPrecios = {
            premium: 9.99,
            vip: 29.99
        };

        if (plan) {
            const precioPlan = planPrecios[plan];
            if (precioPlan) {
                line_items.push({
                    price_data: {
                        currency: "eur",
                        product_data: { name: `Plan ${plan.toUpperCase()}` },
                        unit_amount: Math.round(precioPlan * 100)
                    },
                    quantity: 1
                });
            }
        }

        // ===============================
        // EXTRAS
        // ===============================
        const extraPrecios = {
            subida_24h: 4.99,
            verificado: 14.99,
            auto_subida_6h: 6.99,       // ← NUEVO
            boost_3dias: 2.99,
            anuncios_extra: 4.99
        };

        const extraNombresFront = {
            subida_24h: "Primera posición",
            verificado: "Anuncio verificado",
            auto_subida_6h: "Auto‑subida cada 6h",   // ← NUEVO
            boost_3dias: "Boost 3 días",
            anuncios_extra: "Anuncio Extra"
        };

        const extrasLimpios = (extras || []).filter(
            e => e && typeof e === "object" && e.nombre && extraPrecios[e.nombre]
        );

        extrasLimpios.forEach(extra => {
            line_items.push({
                price_data: {
                    currency: "eur",
                    product_data: { name: extraNombresFront[extra.nombre] },
                    unit_amount: Math.round(extraPrecios[extra.nombre] * 100)
                },
                quantity: extra.cantidad
            });
        });

        if (line_items.length === 0) {
            return res.status(400).json({ error: "No hay nada que cobrar" });
        }

        // ===============================
        // CREAR SESIÓN STRIPE
        // ===============================
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items,
            success_url: "http://127.0.0.1:5500/pago-exitoso.html",
            cancel_url: "http://127.0.0.1:5500/pago-cancelado.html",
            metadata: {
                usuario_id,
                tipo,
                ref_id,
                plan: plan || "",
                extras: JSON.stringify(extrasLimpios)
            }
        });

        return res.json({ url: session.url });

    } catch (error) {
        console.error("Error en /api/checkout:", error);
        return res.status(500).json({ error: "Error creando sesión" });
    }
});


module.exports = router;
