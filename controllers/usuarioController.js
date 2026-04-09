const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/auth");
const db = require("../config/supabase"); // <-- IMPORTANTE para contar publicaciones
const { enviarEmail } = require("../utils/email");

module.exports = {


    // ===============================
    //  REGISTRO
    // ===============================
    register: async (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const { data: existe } = await supabase
            .from("usuarios")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (existe) {
            return res.status(409).json({ error: "El email ya está registrado" });
        }

        const hash = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from("usuarios")
            .insert([{ nombre, email, password: hash }])
            .select()
            .single();

        if (error) {
            return res.status(500).json({ error: "Error al registrar usuario" });
        }

        // ============================
        // 📧 ENVIAR EMAIL DE BIENVENIDA
        // ============================
        await enviarEmail({
            to: "diego90tui@gmail.com",
            subject: "Bienvenido a Velvet",
            html: `
                <h2>Bienvenido a Velvet</h2>
                <p>Hola ${nombre || ""},</p>
                <p>Tu cuenta ha sido creada correctamente.</p>
                <p>Ya puedes iniciar sesión y empezar a publicar anuncios.</p>
                <br>
                <p>Gracias por unirte a Velvet.</p>
            `
        });

        // ============================
        // RESPUESTA FINAL
        // ============================
        return res.json({
            message: "Usuario registrado correctamente",
            user: {
                id: data.id,
                nombre: data.nombre,
                email: data.email
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
},


    // ===============================
    //  LOGIN
    // ===============================
    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        try {
            const { data: usuario } = await supabase
                .from("usuarios")
                .select("*")
                .eq("email", email)
                .maybeSingle();

            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            let coincide = false;
            const passGuardada = (usuario.password || "").trim();
            const esHash = passGuardada.startsWith("$2");

            if (!esHash) {
                if (passGuardada === password) {
                    coincide = true;
                    const hash = await bcrypt.hash(password, 10);

                    await supabase
                        .from("usuarios")
                        .update({ password: hash })
                        .eq("id", usuario.id);
                }
            } else {
                coincide = await bcrypt.compare(password, passGuardada);
            }

            if (!coincide) {
                return res.status(401).json({ error: "Contraseña incorrecta" });
            }

            const token = jwt.sign(
                { id: usuario.id, email: usuario.email },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.json({
                message: "Login exitoso",
                token,
                user: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email
                }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    },


// ===============================
//  SOLICITAR RECUPERACIÓN
// ===============================
recuperarPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email requerido" });
    }

    try {
        const { data: usuario } = await supabase
            .from("usuarios")
            .select("id, email")
            .eq("email", email)
            .maybeSingle();

        // No revelamos si existe o no
        if (!usuario) {
            return res.json({ message: "Si el email existe, se enviará un enlace" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expira = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1h

        await supabase
            .from("usuarios")
            .update({
                reset_token: token,
                reset_expira: expira
            })
            .eq("id", usuario.id);

        const enlace = `https://velvet-backend-clean-production.up.railway.app/auth/reset/${token}`;

        await enviarEmail({
            to: email,
            subject: "Recupera tu contraseña",
            html: `
                <h2>Recuperación de contraseña</h2>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <p><a href="${enlace}">${enlace}</a></p>
                <p>Este enlace expira en 1 hora.</p>
            `
        });

        return res.json({ message: "Si el email existe, se enviará un enlace" });

    } catch (err) {
        console.error("❌ Error en recuperarPassword:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
},

// ===============================
//  VALIDAR TOKEN
// ===============================
validarTokenReset: async (req, res) => {
    const { token } = req.params;

    try {
        const { data: usuario } = await supabase
            .from("usuarios")
            .select("id, reset_expira")
            .eq("reset_token", token)
            .maybeSingle();

        if (!usuario) {
            return res.status(400).json({ error: "Token inválido" });
        }

        if (new Date(usuario.reset_expira) < new Date()) {
            return res.status(400).json({ error: "Token expirado" });
        }

        return res.json({ ok: true });

    } catch (err) {
        console.error("❌ Error en validarTokenReset:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
},
// ===============================
//  RESTABLECER CONTRASEÑA
// ===============================
resetPassword: async (req, res) => {
    const { token } = req.params;
    const { password_nueva } = req.body;

    if (!password_nueva) {
        return res.status(400).json({ error: "Contraseña requerida" });
    }

    try {
        const { data: usuario } = await supabase
            .from("usuarios")
            .select("*")
            .eq("reset_token", token)
            .maybeSingle();

        if (!usuario) {
            return res.status(400).json({ error: "Token inválido" });
        }

        if (new Date(usuario.reset_expira) < new Date()) {
            return res.status(400).json({ error: "Token expirado" });
        }

        const hash = await bcrypt.hash(password_nueva, 10);

        await supabase
            .from("usuarios")
            .update({
                password: hash,
                reset_token: null,
                reset_expira: null
            })
            .eq("id", usuario.id);

        return res.json({ message: "Contraseña actualizada correctamente" });

    } catch (err) {
        console.error("❌ Error en resetPassword:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
},

    // ===============================
    //  OBTENER PERFIL
    // ===============================
    getPerfil: async (req, res) => {
        try {
            const userId = req.user.id;

            const { data: user, error } = await supabase
                .from("usuarios")
                .select("id, nombre, email, anuncios_extra")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("SUPABASE ERROR:", error);
                return res.status(500).json({ error: "Error al obtener el perfil" });
            }

            res.json(user);

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // ===============================
    //  ACTUALIZAR PERFIL
    // ===============================
    updatePerfil: async (req, res) => {
        try {
            const userId = req.user.id;
            const { nombre, email } = req.body;

            if (!nombre || !email) {
                return res.status(400).json({ error: "Faltan datos" });
            }

            const { error } = await supabase
                .from("usuarios")
                .update({ nombre, email })
                .eq("id", userId);

            if (error) return res.status(500).json({ error: "Error al actualizar el perfil" });

            res.json({ mensaje: "Perfil actualizado" });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // ===============================
    //  CAMBIAR CONTRASEÑA
    // ===============================
    updatePassword: async (req, res) => {
        try {
            const userId = req.user.id;
            const { password_actual, password_nueva } = req.body;

            if (!password_actual || !password_nueva) {
                return res.status(400).json({ error: "Faltan datos" });
            }

            const { data: user, error } = await supabase
                .from("usuarios")
                .select("password")
                .eq("id", userId)
                .single();

            if (error) return res.status(500).json({ error: "Error obteniendo usuario" });

            const coincide = await bcrypt.compare(password_actual, user.password);
            if (!coincide) {
                return res.status(401).json({ error: "Contraseña actual incorrecta" });
            }

            const hash = await bcrypt.hash(password_nueva, 10);

            const { error: updateError } = await supabase
                .from("usuarios")
                .update({ password: hash })
                .eq("id", userId);

            if (updateError) return res.status(500).json({ error: "Error al actualizar contraseña" });

            res.json({ mensaje: "Contraseña actualizada correctamente" });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // ===============================
    //  CONTAR PUBLICACIONES
    // ===============================
    contarPublicaciones: async (req, res) => {
        try {
            const userId = req.user.id;

            // 1. Obtener anuncios_extra del usuario
            const { data: usuario, error: errorUsuario } = await supabase
                .from("usuarios")
                .select("anuncios_extra")
                .eq("id", userId)
                .single();

            const extras = usuario?.anuncios_extra || 0;

            // 2. Contar anuncios
            const { count: countAnuncios, error: errorAnuncios } = await supabase
                .from("anuncios")
                .select("*", { count: "exact", head: true })
                .eq("usuario_id", userId);

            if (errorAnuncios) throw errorAnuncios;

            // 3. Contar habitaciones
            const { count: countHabitaciones, error: errorHabitaciones } = await supabase
                .from("habitaciones")
                .select("*", { count: "exact", head: true })
                .eq("usuario_id", userId);

            if (errorHabitaciones) throw errorHabitaciones;

            const total = (countAnuncios || 0) + (countHabitaciones || 0);

            // 4. Límite base + extras, pero máximo 8
            const LIMITE_BASE = 5;
            const LIMITE_MAX = 8;

            let limiteTotal = LIMITE_BASE + extras;
            if (limiteTotal > LIMITE_MAX) limiteTotal = LIMITE_MAX;

            return res.json({
                ok: total < limiteTotal,
                limite: limiteTotal,
                extras,
                anuncios: countAnuncios,
                habitaciones: countHabitaciones,
                total
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ ok: false, error: "Error interno" });
        }
    },

    agregarAnunciosExtra: async (req, res) => {
        try {
            const userId = req.user.id; // ID del usuario autenticado
            const { cantidad } = req.body; // cantidad de extras a sumar (1, 2 o 3)

            if (!cantidad || cantidad < 1) {
                return res.status(400).json({ ok: false, error: "Cantidad inválida" });
            }

            // 1. Obtener anuncios_extra actual del usuario
            const { data: usuario, error: errorUsuario } = await supabase
                .from("usuarios")
                .select("anuncios_extra")
                .eq("id", userId)
                .single();

            if (errorUsuario) throw errorUsuario;

            let extrasActuales = usuario?.anuncios_extra || 0;

            // 2. Sumar extras
            let nuevosExtras = extrasActuales + cantidad;

            // 3. Aplicar máximo absoluto (3 extras → límite total 8)
            if (nuevosExtras > 3) nuevosExtras = 3;

            // 4. Guardar en la base de datos
            const { error: errorUpdate } = await supabase
                .from("usuarios")
                .update({ anuncios_extra: nuevosExtras })
                .eq("id", userId);

            if (errorUpdate) throw errorUpdate;

            return res.json({
                ok: true,
                mensaje: "Anuncios extra añadidos correctamente",
                extras_antes: extrasActuales,
                extras_despues: nuevosExtras
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ ok: false, error: "Error interno" });
        }
    }

};



