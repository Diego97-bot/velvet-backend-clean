// services/emailService.js
const nodemailer = require("nodemailer");

let transporter = null;

// ===============================
// CONFIGURACIÓN AUTOMÁTICA
// ===============================
async function init() {
    if (transporter) return transporter;

    if (process.env.NODE_ENV === "production") {
        // ===============================
        // SMTP REAL (PRODUCCIÓN)
        // ===============================
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        console.log("📨 EmailService: SMTP de producción cargado");
    } else {
        // ===============================
        // ETHEREAL (DESARROLLO)
        // ===============================
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        console.log("📨 EmailService: SMTP de desarrollo (Ethereal) cargado");
        console.log("🔐 Usuario:", testAccount.user);
        console.log("🔐 Pass:", testAccount.pass);
    }

    return transporter;
}

// ===============================
// FUNCIÓN PRINCIPAL
// ===============================
async function enviar({ to, subject, html, text }) {
    const t = await init();

    const info = await t.sendMail({
        from: `"Velvet" <no-reply@velvet.com>`,
        to,
        subject,
        text: text || "",
        html
    });

    // En local: mostrar URL de vista previa
    if (process.env.NODE_ENV !== "production") {
        console.log("📬 Vista previa del email:");
        console.log(nodemailer.getTestMessageUrl(info));
    }

    return info;
}

module.exports = { enviar };
