const supabase = require("../config/supabase");
const { ordenarAnuncios } = require("../utils/ordenacion")

function limitesPlan(plan) {
    const nombre = plan?.nombre?.toLowerCase?.() || "free";

    switch (nombre) {
        case "premium":
            return { max_fotos: 6, max_videos: 0, max_audios: 0 };
        case "vip":
            return { max_fotos: 9, max_videos: 1, max_audios: 1 };
        default:
            return { max_fotos: 4, max_videos: 0, max_audios: 0 };
    }
}

// ===============================
// CREAR HABITACIÓN
// ===============================
exports.crearHabitacion = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            titulo,
            descripcion,
            provincia,
            ciudad,
            telefono,
            numero_habitaciones,
            tipo_habitacion,
            servicios,
            normas,
            precio_semana,
            plan_id
        } = req.body;

        const tipos = JSON.parse(tipo_habitacion || "[]");
        const servs = JSON.parse(servicios || "[]");

        const portada = req.files["portada"]?.[0] || null;
        const galeria = req.files["galeria"] || [];

        // 1. Crear habitación
        const { data: habitacion, error: errorHab } = await supabase
            .from("habitaciones")
            .insert([{
                usuario_id: userId,
                titulo,
                descripcion,
                provincia,
                ciudad,
                telefono,
                numero_habitaciones,
                tipo_habitacion: tipos,
                servicios: servs,
                normas,
                precio_semana,
                plan_id: plan_id ? Number(plan_id) : 1
            }])
            .select()
            .single();

        if (errorHab) return res.json({ ok: false, error: "Error creando habitación" });

        const habitacionId = habitacion.id;

        // 2. SUBIR PORTADA
        let portadaId = null;

        if (portada) {
            const filePath = `habitacion_${habitacionId}/portada_${Date.now()}.jpg`;

            const { error: uploadError } = await supabase.storage
                .from("habitaciones")
                .upload(filePath, portada.buffer, {
                    contentType: portada.mimetype
                });

            if (!uploadError) {
                const publicUrl = supabase.storage
                    .from("habitaciones")
                    .getPublicUrl(filePath).data.publicUrl;

                const { data: fotoPortada } = await supabase
                    .from("fotos_habitaciones")
                    .insert([{ habitacion_id: habitacionId, url: publicUrl }])
                    .select()
                    .single();

                portadaId = fotoPortada.id;
            }
        }

        // 3. SUBIR GALERÍA
        for (const foto of galeria) {
            const filePath = `habitacion_${habitacionId}/galeria_${Date.now()}_${foto.originalname}`;

            const { error: uploadError } = await supabase.storage
                .from("habitaciones")
                .upload(filePath, foto.buffer, {
                    contentType: foto.mimetype
                });

            if (!uploadError) {
                const publicUrl = supabase.storage
                    .from("habitaciones")
                    .getPublicUrl(filePath).data.publicUrl;

                await supabase
                    .from("fotos_habitaciones")
                    .insert([{ habitacion_id: habitacionId, url: publicUrl }]);
            }
        }

        // 4. ACTUALIZAR id_portada
        if (portadaId) {
            await supabase
                .from("habitaciones")
                .update({ id_portada: portadaId })
                .eq("id", habitacionId);
        }

        res.json({ ok: true });

    } catch (err) {
        console.error(err);
        res.json({ ok: false, error: "Error interno" });
    }
};

// ===============================
// CONTAR VISITAS
// ===============================
exports.contarVisita = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { data } = await supabase
            .from("habitaciones")
            .select("visitas_total")
            .eq("id", id)
            .single();

        const visitasActuales = data.visitas_total || 0;

        await supabase
            .from("habitaciones")
            .update({ visitas_total: visitasActuales + 1 })
            .eq("id", id);

        res.json({ ok: true });

    } catch (err) {
        console.error(err);
        res.json({ ok: false });
    }
};

// ===============================
// LISTAR MIS HABITACIONES (VERSIÓN FINAL)
// ===============================
exports.listarMisHabitaciones = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: habitaciones } = await supabase
            .from("habitaciones")
            .select("*")
            .eq("usuario_id", userId)
            .order("id", { ascending: false });

        const habitacionesFinal = [];

        for (const hab of habitaciones) {

            // ===============================
            // 1. PORTADA
            // ===============================
            let portadaUrl = null;

            if (hab.id_portada) {
                const { data: fotoPortada } = await supabase
                    .from("fotos_habitaciones")
                    .select("url")
                    .eq("id", hab.id_portada)
                    .single();

                if (fotoPortada?.url) portadaUrl = fotoPortada.url;
            }

            // ===============================
            // 2. PLAN ACTUAL
            // ===============================
            const { data: planInfo } = await supabase
                .from("planes")
                .select("*")
                .eq("id", hab.plan_id)
                .single();

            const plan = {
                id: planInfo?.id || 1,
                nombre: planInfo?.nombre || "free",
                insignia: planInfo?.insignia || null,
                expira: hab.plan_expira
            };// ===============================
            // 3. EXTRAS ACTIVOS
            // ===============================
            const { data: extras } = await supabase
                .from("mejoras")
                .select(`
        fecha_expira,
        micropagos ( nombre )
    `)
                .eq("ref_id", hab.id)
                .or(`fecha_expira.gt.${new Date().toISOString()},fecha_expira.is.null`);

            // ===============================
            // 3.0 MAPEAR EXTRAS
            // ===============================
            const extrasFinal = extras?.map(e => ({
                nombre: e.micropagos.nombre,
                expira: e.fecha_expira
            })) || [];

            // ===============================
            // 3.1 FILTRAR VERIFICADO
            // ===============================
            const extrasSinVerificado = extrasFinal.filter(e => e.nombre !== "verificado");

            // ===============================
            // 3.2 ELIMINAR EXTRAS DUPLICADOS
            // ===============================
            const extrasUnicos = [];
            const nombresVistos = new Set();

            for (const extra of extrasSinVerificado) {
                if (!nombresVistos.has(extra.nombre)) {
                    extrasUnicos.push(extra);
                    nombresVistos.add(extra.nombre);
                }
            }

            // ===============================
            // 4. OBJETO FINAL
            // ===============================
            habitacionesFinal.push({
                id: hab.id,
                titulo: hab.titulo,
                portada_url: portadaUrl,
                visitas_total: hab.visitas_total,
                verificado: hab.verificado,

                plan,
                extras: extrasUnicos
            });

        }

        res.json(habitacionesFinal);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno" });
    }
};


// ===============================
// LISTAR HABITACIONES PÚBLICAS
// ===============================
exports.listarPublicas = async (req, res) => {
    try {
        const { data: habitaciones } = await supabase
            .from("habitaciones")
            .select("*")
            .order("id", { ascending: false });

        const habitacionesFinal = [];

        for (const hab of habitaciones) {

            // PORTADA
            let portadaUrl = null;
            if (hab.id_portada) {
                const { data: fotoPortada } = await supabase
                    .from("fotos_habitaciones")
                    .select("url")
                    .eq("id", hab.id_portada)
                    .single();
                portadaUrl = fotoPortada?.url || null;
            }

            // GALERÍA
            let { data: galeria } = await supabase
                .from("fotos_habitaciones")
                .select("url")
                .eq("habitacion_id", hab.id);
            galeria = galeria || [];

            // PLAN
            const { data: planInfo } = await supabase
                .from("planes")
                .select("*")
                .eq("id", hab.plan_id)
                .single();

            const plan = {
                id: planInfo?.id || 1,
                nombre: planInfo?.nombre || "free",
                insignia: planInfo?.insignia || null,
                expira: hab.plan_expira
            };

            // LIMITES DEL PLAN
            const limites = limitesPlan(plan);
            galeria = galeria.slice(0, limites.max_fotos);
            if (limites.max_videos === 0) hab.video_url = null;
            if (limites.max_audios === 0) hab.audio_url = null;

            // EXTRAS (AQUÍ ESTABA EL FALLO)
            const { data: extras } = await supabase
                .from("mejoras")
                .select(`
                    fecha_expira,
                    micropagos ( nombre )
                `)
                .eq("ref_id", hab.id)
                .or(`fecha_expira.gt.${new Date().toISOString()},fecha_expira.is.null`);

            const extrasFinal = extras?.map(e => ({
                nombre: e.micropagos.nombre,
                expira: e.fecha_expira
            })) || [];

            // OBJETO FINAL
            habitacionesFinal.push({
                ...hab,
                portada_url: portadaUrl,
                galeria,
                tipo_post: "habitacion",
                plan,
                extras: extrasFinal
            });
        }

        // ORDENACIÓN (usa la misma función)
        const ordenados = ordenarAnuncios(habitacionesFinal);
        res.json(ordenados);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno" });
    }
};



// ===============================
// OBTENER HABITACIÓN PRIVADA
// ===============================
exports.obtenerHabitacionPrivada = async (req, res) => {
    try {
        const id = req.params.id;

        const { data: habitacion } = await supabase
            .from("habitaciones")
            .select("*")
            .eq("id", id)
            .single();

        if (!habitacion) return res.json({ ok: false, error: "Habitación no encontrada" });

        let portadaUrl = null;

        if (habitacion.id_portada) {
            const { data: fotoPortada } = await supabase
                .from("fotos_habitaciones")
                .select("url")
                .eq("id", habitacion.id_portada)
                .single();

            if (fotoPortada?.url) portadaUrl = fotoPortada.url;
        }

        const { data: galeriaData } = await supabase
            .from("fotos_habitaciones")
            .select("*")
            .eq("habitacion_id", id)
            .neq("id", habitacion.id_portada);

        const galeria = (galeriaData || []).map(f => ({
            ...f,
            url: f.url
        }));

        res.json({
            ok: true,
            habitacion: {
                ...habitacion,
                tipo_post: "habitacion",
                portada_url: portadaUrl,
                galeria
            }
        });

    } catch (err) {
        console.error(err);
        res.json({ ok: false, error: "Error interno" });
    }
};

// ===============================
// OBTENER HABITACIÓN PÚBLICA
// ===============================
exports.obtenerHabitacionPublica = async (req, res) => {
    try {
        const id = req.params.id;

        const { data: habitacion } = await supabase
            .from("habitaciones")
            .select("*")
            .eq("id", id)
            .single();

        if (!habitacion) return res.status(404).json({ error: "Habitación no encontrada" });

        // ===============================
        // PORTADA
        // ===============================
        let portadaUrl = null;

        if (habitacion.id_portada) {
            const { data: foto } = await supabase
                .from("fotos_habitaciones")
                .select("url")
                .eq("id", habitacion.id_portada)
                .single();

            if (foto?.url) portadaUrl = foto.url;
        }

        // ===============================
        // GALERÍA COMPLETA
        // ===============================
        let { data: galeria } = await supabase
            .from("fotos_habitaciones")
            .select("url")
            .eq("habitacion_id", id);

        galeria = galeria || [];

        // ===============================
        // PLAN
        // ===============================
        const { data: planInfo } = await supabase
            .from("planes")
            .select("*")
            .eq("id", habitacion.plan_id)
            .single();

        const plan = {
            id: planInfo?.id || 1,
            nombre: planInfo?.nombre || "free",
            insignia: planInfo?.insignia || null,
            expira: habitacion.plan_expira
        };

        // ===============================
        // APLICAR LÍMITES DEL PLAN
        // ===============================
        const limites = limitesPlan(plan);

        // FOTOS
        galeria = galeria.slice(0, limites.max_fotos);

        // VIDEO
        if (limites.max_videos === 0) {
            habitacion.video_url = null;
        }

        // AUDIO
        if (limites.max_audios === 0) {
            habitacion.audio_url = null;
        }

        // ===============================
        // RESPUESTA FINAL
        // ===============================
        res.json({
            habitacion: {
                ...habitacion,
                portada_url: portadaUrl,
                galeria,
                tipo_post: "habitacion",
                plan
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno" });
    }
};

// ===============================
// EDITAR HABITACIÓN
// ===============================
exports.editarHabitacion = async (req, res) => {
    try {
        console.log("\n==============================");
        console.log(">>> EJECUTANDO editarHabitacion CORRECTO <<<");
        console.log("==============================\n");

        const habitacionId = req.params.id;
        console.log("Habitación ID:", habitacionId);

        const {
            titulo,
            descripcion,
            provincia,
            ciudad,
            telefono,
            numero_habitaciones,
            tipo_habitacion,
            servicios,
            normas,
            precio_semana
        } = req.body;

        const tipos = JSON.parse(tipo_habitacion || "[]");
        const servs = JSON.parse(servicios || "[]");

        // ===============================
        // 0. OBTENER PLAN DE LA HABITACIÓN
        // ===============================
        const { data: habitacionPlan } = await supabase
            .from("habitaciones")
            .select("plan_id")
            .eq("id", habitacionId)
            .single();

        console.log("habitacionPlan:", habitacionPlan);

        const planIdReal = habitacionPlan?.plan_id || 1;
        console.log("Plan REAL:", planIdReal);

        // ===============================
        // 1. OBTENER INFORMACIÓN DEL PLAN
        // ===============================
        const { data: planInfo } = await supabase
            .from("planes")
            .select("*")
            .eq("id", planIdReal)
            .single();

        console.log("planInfo:", planInfo);

        const plan = {
            id: planInfo?.id || 1,
            nombre: (planInfo?.nombre || "free").toLowerCase(),
            insignia: planInfo?.insignia || null
        };

        console.log("PLAN NORMALIZADO:", plan);

        // ===============================
        // 2. OBTENER LÍMITES DEL PLAN
        // ===============================
        const limites = limitesPlan(plan);
        console.log("LIMITES DEL PLAN:", limites);

        // ===============================
        // 3. CONTAR FOTOS ORIGINALES
        // ===============================
        const originales = req.body.galeria_original_id || [];
        const totalOriginales = Array.isArray(originales)
            ? originales.length
            : originales
            ? 1
            : 0;

        console.log("FOTOS ORIGINALES:", totalOriginales);

        // ===============================
        // 4. CONTAR FOTOS NUEVAS
        // ===============================
        const nuevasFotos = req.files["galeria_nueva"] || [];
        const totalNuevas = nuevasFotos.length;

        console.log("FOTOS NUEVAS:", totalNuevas);

        // ===============================
        // 5. PORTADA (SIEMPRE CUENTA COMO 1)
        // ===============================
        const totalFotos = totalOriginales + totalNuevas + 1;
        console.log("TOTAL FOTOS (incluyendo portada):", totalFotos);

        if (totalFotos > limites.max_fotos) {
            console.log("ERROR: Excede límite de fotos");
            return res.json({
                ok: false,
                error: `Tu plan ${plan.nombre.toUpperCase()} solo permite ${limites.max_fotos} fotos (incluyendo portada).`
            });
        }

        // ===============================
        // 6. VALIDAR VIDEO
        // ===============================
        if (req.files["video"]?.length > 0 && limites.max_videos === 0) {
            console.log("ERROR: Plan no permite video");
            return res.json({
                ok: false,
                error: `Tu plan ${plan.nombre.toUpperCase()} no permite subir vídeos.`
            });
        }

        // ===============================
        // 7. VALIDAR AUDIO
        // ===============================
        if (req.files["audio"]?.length > 0 && limites.max_audios === 0) {
            console.log("ERROR: Plan no permite audio");
            return res.json({
                ok: false,
                error: `Tu plan ${plan.nombre.toUpperCase()} no permite subir audios.`
            });
        }

        // ===============================
        // 8. ACTUALIZAR CAMPOS BÁSICOS
        // ===============================
        console.log("Actualizando campos básicos...");

        await supabase
            .from("habitaciones")
            .update({
                titulo,
                descripcion,
                provincia,
                ciudad,
                telefono,
                numero_habitaciones,
                tipo_habitacion: tipos,
                servicios: servs,
                normas,
                precio_semana
            })
            .eq("id", habitacionId);

        // ===============================
        // 9. PORTADA
        // ===============================
        let portadaId = req.body.portada_original_id
            ? Number(req.body.portada_original_id)
            : null;

        const portadaNueva = req.files["portada"]?.[0] || null;

        if (portadaNueva) {
            console.log("Subiendo nueva portada...");

            const filePath = `habitacion_${habitacionId}/portada_${Date.now()}.jpg`;

            const { error: uploadError } = await supabase.storage
                .from("habitaciones")
                .upload(filePath, portadaNueva.buffer, {
                    contentType: portadaNueva.mimetype
                });

            if (!uploadError) {
                const publicUrl = supabase.storage
                    .from("habitaciones")
                    .getPublicUrl(filePath).data.publicUrl;

                const { data: fotoPortada } = await supabase
                    .from("fotos_habitaciones")
                    .insert([{ habitacion_id: habitacionId, url: publicUrl }])
                    .select()
                    .single();

                portadaId = fotoPortada.id;

                await supabase
                    .from("habitaciones")
                    .update({ id_portada: portadaId })
                    .eq("id", habitacionId);
            }
        }

        // ===============================
        // 10. GALERÍA ORIGINAL
        // ===============================
        const galeriaOriginalIds = req.body.galeria_original_id || [];
        const idsArray = Array.isArray(galeriaOriginalIds)
            ? galeriaOriginalIds
            : [galeriaOriginalIds];

        const { data: fotosBD } = await supabase
            .from("fotos_habitaciones")
            .select("*")
            .eq("habitacion_id", habitacionId);

        console.log("FOTOS EN BD:", fotosBD?.length);

        for (const foto of fotosBD) {
            if (foto.id !== portadaId && !idsArray.includes(foto.id.toString())) {
                console.log("Eliminando foto:", foto.id);

                const url = new URL(foto.url);
                const cleanPath = decodeURIComponent(url.pathname.split("/habitaciones/")[1]);

                await supabase.storage.from("habitaciones").remove([cleanPath]);

                await supabase
                    .from("fotos_habitaciones")
                    .delete()
                    .eq("id", foto.id);
            }
        }

        // ===============================
        // 11. GALERÍA NUEVA
        // ===============================
        const nuevas = req.files["galeria_nueva"] || [];

        for (const foto of nuevas) {
            console.log("Subiendo foto nueva:", foto.originalname);

            const filePath = `habitacion_${habitacionId}/galeria_${Date.now()}_${foto.originalname}`;

            const { error: uploadError } = await supabase.storage
                .from("habitaciones")
                .upload(filePath, foto.buffer, {
                    contentType: foto.mimetype
                });

            if (!uploadError) {
                const publicUrl = supabase.storage
                    .from("habitaciones")
                    .getPublicUrl(filePath).data.publicUrl;

                await supabase
                    .from("fotos_habitaciones")
                    .insert([{ habitacion_id: habitacionId, url: publicUrl }]);
            }
        }

        // ===============================
        // 12. VIDEO
        // ===============================
        const videoFile = req.files["video"]?.[0] || null;

        if (req.body.eliminar_video === "1") {
            console.log("Eliminando video...");

            await supabase
                .from("habitaciones")
                .update({ video_url: null, video_ruta: null })
                .eq("id", habitacionId);
        }

        if (videoFile) {
            console.log("Subiendo video...");

            const ext = videoFile.originalname.split(".").pop();
            const ruta = `habitacion_${habitacionId}/video_${Date.now()}.${ext}`;

            const { error } = await supabase.storage
                .from("habitaciones")
                .upload(ruta, videoFile.buffer, { contentType: videoFile.mimetype });

            if (!error) {
                const publicUrl = supabase.storage
                    .from("habitaciones")
                    .getPublicUrl(ruta).data.publicUrl;

                await supabase
                    .from("habitaciones")
                    .update({ video_url: publicUrl, video_ruta: ruta })
                    .eq("id", habitacionId);
            }
        }

        // ===============================
        // 13. AUDIO
        // ===============================
        const audioFile = req.files["audio"]?.[0] || null;

        if (req.body.eliminar_audio === "1") {
            console.log("Eliminando audio...");

            await supabase
                .from("habitaciones")
                .update({ audio_url: null, audio_ruta: null })
                .eq("id", habitacionId);
        }

        if (audioFile) {
            console.log("Subiendo audio...");

            const ext = audioFile.originalname.split(".").pop();
            const ruta = `habitacion_${habitacionId}/audio_${Date.now()}.${ext}`;

            const { error } = await supabase.storage
                .from("habitaciones")
                .upload(ruta, audioFile.buffer, { contentType: audioFile.mimetype });

            if (!error) {
                const publicUrl = supabase.storage
                    .from("habitaciones")
                    .getPublicUrl(ruta).data.publicUrl;

                await supabase
                    .from("habitaciones")
                    .update({ audio_url: publicUrl, audio_ruta: ruta })
                    .eq("id", habitacionId);
            }
        }

        console.log(">>> HABITACIÓN ACTUALIZADA CORRECTAMENTE <<<");

        res.json({ ok: true });

    } catch (err) {
        console.error("ERROR GENERAL:", err);
        res.json({ ok: false, error: "Error interno" });
    }
};




// ===============================
// BORRAR HABITACIÓN
// ===============================
exports.borrarHabitacion = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;

        const { data: habitacion } = await supabase
            .from("habitaciones")
            .select("id")
            .eq("id", id)
            .eq("usuario_id", userId)
            .single();

        if (!habitacion) return res.status(403).json({ ok: false, error: "No autorizado" });

        const { data: fotos } = await supabase
            .from("fotos_habitaciones")
            .select("url")
            .eq("habitacion_id", id);

        let paths = [];

        if (fotos && fotos.length > 0) {
            paths = fotos
                .map(f => {
                    try {
                        const url = new URL(f.url);
                        const cleanPath = decodeURIComponent(url.pathname.split("/habitaciones/")[1]);
                        return cleanPath;
                    } catch {
                        return null;
                    }
                })
                .filter(p => p);
        }

        if (paths.length > 0) {
            await supabase.storage.from("habitaciones").remove(paths);
        }

        await supabase.from("fotos_habitaciones").delete().eq("habitacion_id", id);
        await supabase.from("habitaciones").delete().eq("id", id);

        res.json({ ok: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Error interno" });
    }
};
