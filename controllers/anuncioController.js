const supabase = require("../config/supabase")
const { ordenarAnuncios } = require("../utils/ordenacion")
const { enviarEmail } = require("../utils/email");

function limitesPlan(plan) {
    if (!plan?.nombre) return { max_fotos: 4, max_videos: 0, max_audios: 0 };

    const nombre = plan.nombre.toLowerCase();

    if (nombre === "premium") return { max_fotos: 6, max_videos: 0, max_audios: 0 };
    if (nombre === "vip") return { max_fotos: 9, max_videos: 1, max_audios: 1 };

    return { max_fotos: 4, max_videos: 0, max_audios: 0 }; // free
}


// ===============================
// CREAR ANUNCIO
// ===============================
exports.crearAnuncio = async (req, res) => {
    try {
        const {
            tipo, categoria, titulo, descripcion,
            provincia, ciudad, telefono, servicios,
            edad, nacionalidad, precio
        } = req.body;

        const { data: anuncio, error: errorInsert } = await supabase
            .from("anuncios")
            .insert([{
                usuario_id: req.user.id,
                tipo,
                categoria,
                titulo,
                descripcion,
                provincia,
                ciudad,
                telefono,
                servicios,
                edad,
                nacionalidad,
                precio: parseInt(precio),
                plan_id: 1,
                fecha_creado: new Date(),
                visitas_total: 0
            }])
            .select()
            .single();

        if (errorInsert) return res.status(500).json({ error: "Error al crear anuncio" });

        const anuncioId = anuncio.id;

        // ===============================
        // PORTADA
        // ===============================
        const portada = req.files?.portada?.[0];
        let portadaId = null;

        if (portada) {
            const extension = portada.mimetype.split("/")[1];
            const filePath = `anuncios/${anuncioId}/portada-${Date.now()}.${extension}`;

            const { error: uploadError } = await supabase.storage
                .from("fotos")
                .upload(filePath, portada.buffer, { contentType: portada.mimetype });

            if (!uploadError) {
                const { data: publicUrlData } = supabase.storage.from("fotos").getPublicUrl(filePath);
                const urlPublica = publicUrlData.publicUrl;

                const { data: fotoData } = await supabase
                    .from("fotos")
                    .insert([{ anuncio_id: anuncioId, url: urlPublica, ruta: filePath }])
                    .select();

                portadaId = fotoData[0].id;

                await supabase
                    .from("anuncios")
                    .update({ id_foto_portada: portadaId })
                    .eq("id", anuncioId);
            }
        }

        // ===============================
        // GALERÍA (máx 3)
        // ===============================
        const galeria = req.files?.galeria || [];

        for (const foto of galeria.slice(0, 3)) {
            const extension = foto.mimetype.split("/")[1];
            const filePath = `anuncios/${anuncioId}/galeria-${Date.now()}-${Math.random()}.${extension}`;

            const { error: errorGaleria } = await supabase.storage
                .from("fotos")
                .upload(filePath, foto.buffer, { contentType: foto.mimetype });

            if (!errorGaleria) {
                const { data: publicUrlData } = supabase.storage.from("fotos").getPublicUrl(filePath);
                const urlPublica = publicUrlData.publicUrl;

                await supabase.from("fotos").insert([{ anuncio_id: anuncioId, url: urlPublica, ruta: filePath }]);
            }
        }
        await enviarEmail({
            to: "diego90tui@gmail.com",
            subject: "Tu anuncio está publicado",
            html: `
                <p>Hola,</p>
                <p>Tu anuncio se ha publicado correctamente y ya está visible en Velvet.</p>
                <p>Puedes gestionarlo desde tu panel de control.</p>
                <p>Gracias por usar Velvet.</p>
            `
        });
        res.json({
            ok: true,
            message: "Anuncio creado correctamente",
            anuncio_id: anuncioId,
            portada_id: portadaId
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ===============================
// EDITAR ANUNCIO
// ===============================
exports.editarAnuncio = async (req, res) => {
    try {
        const anuncioId = req.params.id;

        const {
            tipo, categoria, titulo, descripcion,
            provincia, ciudad, telefono, servicios,
            edad, nacionalidad, precio, portada_original
        } = req.body;

        const serviciosArray = JSON.parse(servicios || "[]");

        // ===============================
        // OBTENER ANUNCIO
        // ===============================
        const { data: anuncio } = await supabase
            .from("anuncios")
            .select("*")
            .eq("id", anuncioId)
            .single();

        if (!anuncio) return res.status(404).json({ ok: false, error: "Anuncio no encontrado" });

        // ===============================
        // OBTENER PLAN DEL ANUNCIO
        // ===============================
        const { data: plan } = await supabase
            .from("planes")
            .select("*")
            .eq("id", anuncio.plan_id)
            .single();

        if (!plan) {
            return res.status(500).json({ ok: false, error: "No se pudo cargar el plan del anuncio" });
        }

        // ===============================
        // PORTADA
        // ===============================
        let nuevaPortadaId = anuncio.id_foto_portada;
        let nuevaPortadaUrl = portada_original || null;

        const portada = req.files?.portada?.[0];

        if (portada) {
            // Borrar portada anterior
            if (anuncio.id_foto_portada) {
                const { data: fotoPortada } = await supabase
                    .from("fotos")
                    .select("*")
                    .eq("id", anuncio.id_foto_portada)
                    .single();

                if (fotoPortada) {
                    await supabase.storage.from("fotos").remove([fotoPortada.ruta]);
                    await supabase.from("fotos").delete().eq("id", fotoPortada.id);
                }
            }

            const extension = portada.mimetype.split("/")[1];
            const filePath = `anuncios/${anuncioId}/portada-${Date.now()}.${extension}`;

            const { error: uploadError } = await supabase.storage
                .from("fotos")
                .upload(filePath, portada.buffer, { contentType: portada.mimetype });

            if (!uploadError) {
                const { data: publicUrlData } = supabase.storage.from("fotos").getPublicUrl(filePath);
                const urlPublica = publicUrlData.publicUrl;

                const { data: fotoData } = await supabase
                    .from("fotos")
                    .insert([{ anuncio_id: anuncioId, url: urlPublica, ruta: filePath }])
                    .select();

                nuevaPortadaId = fotoData[0].id;
                nuevaPortadaUrl = urlPublica;
            }
        }

        // ===============================
        // GALERÍA
        // ===============================
        let galeriaOriginal = [];

        if (req.body.galeria_original) {
            galeriaOriginal = Array.isArray(req.body.galeria_original)
                ? req.body.galeria_original
                : [req.body.galeria_original];
        }

        // Obtener fotos actuales
        const { data: galeriaDB } = await supabase
            .from("fotos")
            .select("*")
            .eq("anuncio_id", anuncioId);

        // Eliminar fotos que ya no están
        for (const foto of galeriaDB) {
            if (foto.id !== nuevaPortadaId && !galeriaOriginal.includes(foto.url)) {
                await supabase.storage.from("fotos").remove([foto.ruta]);
                await supabase.from("fotos").delete().eq("id", foto.id);
            }
        }

        // Normalizar nuevas fotos
        let nuevasFotos = req.files?.galeria_nueva || [];
        if (!Array.isArray(nuevasFotos)) nuevasFotos = [nuevasFotos];

        // Contar portada como foto
        const tienePortada = nuevaPortadaId ? 1 : 0;

        // Validar límite
        const totalFotos = galeriaOriginal.length + nuevasFotos.length + tienePortada;

        if (totalFotos > plan.max_fotos) {
            return res.status(400).json({
                ok: false,
                error: `Tu plan solo permite ${plan.max_fotos} fotos (incluyendo portada).`
            });
        }

        // Subir nuevas fotos
        for (const foto of nuevasFotos) {
            if (!foto) continue;

            const extension = foto.mimetype.split("/")[1];
            const filePath = `anuncios/${anuncioId}/galeria-${Date.now()}-${Math.random()}.${extension}`;

            const { error: errorGaleria } = await supabase.storage
                .from("fotos")
                .upload(filePath, foto.buffer, { contentType: foto.mimetype });

            if (!errorGaleria) {
                const { data: publicUrlData } = supabase.storage.from("fotos").getPublicUrl(filePath);
                const urlPublica = publicUrlData.publicUrl;

                await supabase.from("fotos").insert([
                    { anuncio_id: anuncioId, url: urlPublica, ruta: filePath }
                ]);
            }
        }

        // ===============================
        // ELIMINAR VIDEO (si el usuario lo pidió)
        // ===============================
        if (req.body.eliminar_video === "1" && anuncio.video_ruta) {
            await supabase.storage.from("video").remove([anuncio.video_ruta]);
            await supabase.from("anuncios").update({
                video_url: null,
                video_ruta: null,
                video_tamano: null
            }).eq("id", anuncioId);

            anuncio.video_ruta = null;
            anuncio.video_url = null;
        }

// ===============================
// SUBIR VIDEO NUEVO
// ===============================
const video = req.files?.video?.[0];

if (video) {
    if (plan.max_videos === 0) {
        return res.status(400).json({ ok: false, error: "Tu plan no permite subir videos." });
    }

    if (video.size > plan.max_tamano_video * 1024 * 1024) {
        return res.status(400).json({ ok: false, error: `El video supera el límite de ${plan.max_tamano_video}MB.` });
    }

    const ext = video.mimetype.split("/")[1];
    const rutaVideo = `anuncios/${anuncioId}/video-${Date.now()}.${ext}`;

    const { error: errVid } = await supabase.storage
        .from("video")
        .upload(rutaVideo, video.buffer, { contentType: video.mimetype });

    console.log("ERROR SUBIENDO VIDEO:", errVid); // ✔ AHORA SÍ EXISTE

    if (!errVid) {
        const { data: urlData } = supabase.storage.from("video").getPublicUrl(rutaVideo);

        await supabase
            .from("anuncios")
            .update({
                video_url: urlData.publicUrl,
                video_ruta: rutaVideo,
                video_tamano: video.size
            })
            .eq("id", anuncioId);
    }
}


        // ===============================
        // ELIMINAR AUDIO (si el usuario lo pidió)
        // ===============================
        if (req.body.eliminar_audio === "1" && anuncio.audio_ruta) {
            await supabase.storage.from("audio").remove([anuncio.audio_ruta]);
            await supabase.from("anuncios").update({
                audio_url: null,
                audio_ruta: null,
                audio_tamano: null
            }).eq("id", anuncioId);

            anuncio.audio_ruta = null;
            anuncio.audio_url = null;
        }

        // ===============================
        // SUBIR AUDIO NUEVO
        // ===============================
        console.log("DEBUG AUDIO:", req.files?.audio);
        const audio = req.files?.audio?.[0];

        if (audio) {
            if (plan.max_audios === 0) {
                return res.status(400).json({ ok: false, error: "Tu plan no permite subir audios." });
            }

            if (audio.size > plan.max_tamano_audio * 1024 * 1024) {
                return res.status(400).json({ ok: false, error: `El audio supera el límite de ${plan.max_tamano_audio}MB.` });
            }

            const ext = audio.mimetype.split("/")[1];
            const rutaAudio = `anuncios/${anuncioId}/audio-${Date.now()}.${ext}`;

            const { error: errAud } = await supabase.storage
                .from("audio")
                .upload(rutaAudio, audio.buffer, { contentType: audio.mimetype });

            if (!errAud) {
                const { data: urlData } = supabase.storage.from("audio").getPublicUrl(rutaAudio);

                await supabase
                    .from("anuncios")
                    .update({
                        audio_url: urlData.publicUrl,
                        audio_ruta: rutaAudio,
                        audio_tamano: audio.size
                    })
                    .eq("id", anuncioId);
            }
        }
const precioFinal = precio ? parseInt(precio) : anuncio.precio;
const edadFinal = edad ? parseInt(edad) : anuncio.edad;
const serviciosFinal = serviciosArray.length ? serviciosArray : anuncio.servicios;

        // ===============================
        // ACTUALIZAR CAMPOS DEL ANUNCIO
        // ===============================
await supabase
    .from("anuncios")
    .update({
        tipo: tipo || anuncio.tipo,
        categoria: categoria || anuncio.categoria,
        titulo: titulo || anuncio.titulo,
        descripcion: descripcion || anuncio.descripcion,
        provincia: provincia || anuncio.provincia,
        ciudad: ciudad || anuncio.ciudad,
        telefono: telefono || anuncio.telefono,
        servicios: serviciosFinal,
        edad: edadFinal,
        nacionalidad: nacionalidad || anuncio.nacionalidad,
        precio: precioFinal,
        id_foto_portada: nuevaPortadaId
    })
    .eq("id", anuncioId);


        res.json({ ok: true, message: "Anuncio actualizado correctamente", anuncio_id: anuncioId });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: "Error interno del servidor" });
    }
};



// ===============================
// CONTAR VISITAS
// ===============================
exports.contarVisita = async (req, res) => {
    try {
        const id = Number(req.params.id);

        const { data } = await supabase
            .from("anuncios")
            .select("visitas_total")
            .eq("id", id)
            .single();

        const visitasActuales = data.visitas_total || 0;

        await supabase
            .from("anuncios")
            .update({ visitas_total: visitasActuales + 1 })
            .eq("id", id);

        res.json({ ok: true });

    } catch (err) {
        console.error(err);
        res.json({ ok: false });
    }
};

// ===============================
// LISTAR MIS ANUNCIOS (VERSIÓN FINAL)
// ===============================
exports.listarMisAnuncios = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data: anuncios } = await supabase
            .from("anuncios")
            .select("*")
            .eq("usuario_id", userId)
            .order("id", { ascending: false });

        const anunciosFinal = [];

        for (const anuncio of anuncios) {

            // ===============================
            // 1. PORTADA
            // ===============================
            let portadaUrl = null;

            if (anuncio.id_foto_portada) {
                const { data: foto } = await supabase
                    .from("fotos")
                    .select("*")
                    .eq("id", anuncio.id_foto_portada)
                    .single();

                if (foto) portadaUrl = foto.url;
            }

            // ===============================
            // 2. PLAN ACTUAL
            // ===============================
            const { data: planInfo } = await supabase
                .from("planes")
                .select("*")
                .eq("id", anuncio.plan_id)
                .single();

            const plan = {
                id: planInfo?.id || 1,
                nombre: planInfo?.nombre || "free",
                insignia: planInfo?.insignia || null,
                expira: anuncio.plan_expira
            };
            // ===============================
            // 3. EXTRAS ACTIVOS
            // ===============================
            const { data: extras } = await supabase
                .from("mejoras")
                .select(`
        fecha_expira,
        micropagos ( nombre )
    `)
                .eq("ref_id", anuncio.id)   // 👈 CORREGIDO: antes ponía hab.id
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

            for (const extra of extrasSinVerificado) {   // 👈 CORREGIDO
                if (!nombresVistos.has(extra.nombre)) {
                    extrasUnicos.push(extra);
                    nombresVistos.add(extra.nombre);
                }
            }

            // ===============================
            // 4. OBJETO FINAL
            // ===============================
            anunciosFinal.push({
                id: anuncio.id,
                titulo: anuncio.titulo,
                portada_url: portadaUrl,
                visitas_total: anuncio.visitas_total,
                verificado: anuncio.verificado,

                plan,
                extras: extrasUnicos
            });

        }

        res.json(anunciosFinal);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


// ===============================
// LISTAR PÚBLICOS
// ===============================
// ===============================
// LISTAR ANUNCIOS PÚBLICOS
// ===============================
exports.listarPublicos = async (req, res) => {
    try {
        const { data: anuncios } = await supabase
            .from("anuncios")
            .select("*")
            .order("id", { ascending: false });

        const anunciosFinal = [];

        for (const anuncio of anuncios) {

            // ===============================
            // PORTADA
            // ===============================
            let portadaUrl = null;

            if (anuncio.id_foto_portada) {
                const { data: foto } = await supabase
                    .from("fotos")
                    .select("url")
                    .eq("id", anuncio.id_foto_portada)
                    .single();

                if (foto?.url) portadaUrl = foto.url;
            }

            // ===============================
            // GALERÍA COMPLETA
            // ===============================
            let { data: galeria } = await supabase
                .from("fotos")
                .select("url")
                .eq("anuncio_id", anuncio.id);

            galeria = galeria || [];

            // ===============================
            // PLAN
            // ===============================
            const { data: planInfo } = await supabase
                .from("planes")
                .select("*")
                .eq("id", anuncio.plan_id)
                .single();

            const plan = {
                id: planInfo?.id || 1,
                nombre: planInfo?.nombre || "free",
                insignia: planInfo?.insignia || null,
                expira: anuncio.plan_expira
            };

            // ===============================
            // APLICAR LÍMITES DEL PLAN
            // ===============================
            const limites = limitesPlan(plan);

            // FOTOS
            galeria = galeria.slice(0, limites.max_fotos);

            // VIDEO
            if (limites.max_videos === 0) {
                anuncio.video_url = null;
            }

            // AUDIO
            if (limites.max_audios === 0) {
                anuncio.audio_url = null;
            }

            // ===============================
            // EXTRAS
            // ===============================
            const { data: extras } = await supabase
                .from("mejoras")
                .select(`
                    fecha_expira,
                    micropagos ( nombre )
                `)
                .eq("ref_id", anuncio.id)
                .or(`fecha_expira.gt.${new Date().toISOString()},fecha_expira.is.null`);

            const extrasFinal = extras?.map(e => ({
                nombre: e.micropagos.nombre,
                expira: e.fecha_expira
            })) || [];

            // ===============================
            // OBJETO FINAL
            // ===============================
            anunciosFinal.push({
                ...anuncio,
                portada_url: portadaUrl,
                galeria,
                tipo_post: "anuncio",
                plan,
                extras: extrasFinal
            });
        }

        // 👉 ORDENACIÓN AQUÍ
        const ordenados = ordenarAnuncios(anunciosFinal);

        res.json(ordenados);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ===============================
// OBTENER ANUNCIO PRIVADO
// ===============================
exports.obtenerAnuncioPrivado = async (req, res) => {
    try {
        const id = req.params.id;

        const { data: anuncio } = await supabase
            .from("anuncios")
            .select("*")
            .eq("id", id)
            .single();

        if (!anuncio) return res.json({ ok: false, error: "Anuncio no encontrado" });

        let portadaUrl = null;

        if (anuncio.id_foto_portada) {
            const { data: fotoPortada } = await supabase
                .from("fotos")
                .select("url")
                .eq("id", anuncio.id_foto_portada)
                .single();

            if (fotoPortada?.url) portadaUrl = fotoPortada.url;
        }

        const { data: galeriaData } = await supabase
            .from("fotos")
            .select("*")
            .eq("anuncio_id", id)
            .neq("id", anuncio.id_foto_portada)
            .order("id", { ascending: true });

        const galeria = (galeriaData || []).map(f => ({
            ...f,
            url: f.url
        }));

        let plan = { nombre: "normal", insignia: null };

        if (anuncio.plan_id) {
            const { data: planData } = await supabase
                .from("planes")
                .select("*")
                .eq("id", anuncio.plan_id)
                .single();

            if (planData) plan = planData;
        }

        res.json({
            ok: true,
            anuncio: {
                ...anuncio,
                portada_url: portadaUrl,
                galeria,
                plan_nombre: plan.nombre,
                insignia: plan.insignia,
                tipo_post: "anuncio"
            }
        });

    } catch (err) {
        console.error(err);
        res.json({ ok: false, error: "Error interno" });
    }
};

// ===============================
// OBTENER ANUNCIO PÚBLICO
// ===============================
exports.obtenerAnuncioPublico = async (req, res) => {
    try {
        const id = req.params.id;

        const { data: anuncio } = await supabase
            .from("anuncios")
            .select("*")
            .eq("id", id)
            .single();

        if (!anuncio) return res.status(404).json({ error: "Anuncio no encontrado" });

        let portadaUrl = null;

        if (anuncio.id_foto_portada) {
            const { data: foto } = await supabase
                .from("fotos")
                .select("url")
                .eq("id", anuncio.id_foto_portada)
                .single();

            if (foto?.url) portadaUrl = foto.url;
        }

        const { data: galeria } = await supabase
            .from("fotos")
            .select("url")
            .eq("anuncio_id", id);

        res.json({
            anuncio: {
                ...anuncio,
                portada_url: portadaUrl,
                galeria: galeria || [],
                tipo_post: "anuncio"
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// ===============================
// BORRAR ANUNCIO
// ===============================
exports.borrarAnuncio = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        const { data: anuncioData } = await supabase
            .from("anuncios")
            .select("*")
            .eq("id", id)
            .eq("usuario_id", userId)
            .limit(1);

        const anuncio = anuncioData?.[0] || null;

        if (!anuncio) return res.json({ ok: false, error: "No encontrado o no autorizado" });

        const { data: fotos } = await supabase
            .from("fotos")
            .select("ruta")
            .eq("anuncio_id", id);

        if (fotos && fotos.length > 0) {
            const paths = fotos.map(f => f.ruta);
            await supabase.storage.from("fotos").remove(paths);
        }

        await supabase.from("fotos").delete().eq("anuncio_id", id);
        await supabase.from("anuncios").delete().eq("id", id).eq("usuario_id", userId);

        res.json({ ok: true });

    } catch (err) {
        console.error(err);
        res.json({ ok: false, error: "Error interno" });
    }
};
