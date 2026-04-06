// controllers/planesController.js

const supabase = require("../config/supabase");

exports.obtenerPlan = async (req, res) => {
    try {
        const planId = req.params.id;

        const { data: plan, error } = await supabase
            .from("planes")
            .select("*")
            .eq("id", planId)
            .single();

        if (error || !plan) {
            return res.status(404).json({ ok: false, error: "Plan no encontrado" });
        }

        res.json(plan);

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Error interno del servidor" });
    }
};
