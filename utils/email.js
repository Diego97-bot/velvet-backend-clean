const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEmail({ to, subject, html }) {
    try {
        const { data, error } = await resend.emails.send({
            from: "Velvet <onboarding@resend.dev>",
            to,
            subject,
            html
        });

        if (error) {
            console.error("❌ Error enviando email:", error);
            return false;
        }

        console.log("📧 Email enviado:", data);
        return true;

    } catch (err) {
        console.error("❌ Error inesperado enviando email:", err);
        return false;
    }
}

module.exports = { enviarEmail };

