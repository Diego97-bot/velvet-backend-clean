module.exports = function plantillaPublicacion(nombre, titulo) {
    return `
        <div style="font-family: Arial; padding: 20px;">
            <h2>Hola ${nombre},</h2>
            <p>Tu anuncio <strong>${titulo}</strong> ha sido publicado correctamente.</p>
            <p>Gracias por usar Velvet.</p>
        </div>
    `;
};
