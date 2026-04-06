require("dotenv").config();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// PLANES
const planes = [
    {
        id: 1,
        nombre: "Plan Free",
        descripcion: "Hasta 5 fotos, sin subidas, sin insignias",
        precio: 0,
        metadata: { tipo: "plan", plan_id: 1 }
    },
    {
        id: 2,
        nombre: "Plan Premium",
        descripcion: "Hasta 9 fotos, insignia premium, prioridad",
        precio: 9.99,
        metadata: { tipo: "plan", plan_id: 2 }
    },
    {
        id: 3,
        nombre: "Plan VIP",
        descripcion: "Hasta 9 fotos, 1 video, 1 audio, primeras posiciones",
        precio: 19.99,
        metadata: { tipo: "plan", plan_id: 3 }
    }
];

// EXTRAS / MEJORAS
const extras = [
    {
        id: 1,
        nombre: "Subida 24h",
        descripcion: "Subida a primera posición durante 24 horas",
        precio: 4.99,
        metadata: { tipo: "extra", extra_id: 1 }
    },
    {
        id: 2,
        nombre: "Anuncio verificado",
        descripcion: "Insignia de verificación",
        precio: 14.99,
        metadata: { tipo: "extra", extra_id: 2 }
    },
    {
        id: 3,
        nombre: "Auto-subida cada 6h",
        descripcion: "Subida automática cada 6 horas",
        precio: 6.99,
        metadata: { tipo: "extra", extra_id: 3 }
    },
    {
        id: 4,
        nombre: "Boost 3 días",
        descripcion: "Boost de visibilidad durante 3 días",
        precio: 2.99,
        metadata: { tipo: "extra", extra_id: 4 }
    },
    {
        id: 5,
        nombre: "Anuncio Extra",
        descripcion: "Permite publicar un anuncio adicional",
        precio: 4.99,
        metadata: { tipo: "extra", extra_id: 5 }
    }
];

async function crearProductoConPrecio(item) {
    const producto = await stripe.products.create({
        name: item.nombre,
        description: item.descripcion
    });

    const price = await stripe.prices.create({
        unit_amount: Math.round(item.precio * 100),
        currency: "eur",
        product: producto.id,
        metadata: item.metadata
    });

    return { producto, price };
}

async function main() {
    console.log("🚀 Creando planes...");
    for (const plan of planes) {
        const res = await crearProductoConPrecio(plan);
        console.log(`✔ Plan creado: ${plan.nombre}`);
        console.log("   Product ID:", res.producto.id);
        console.log("   Price ID:", res.price.id);
    }

    console.log("\n🔥 Creando extras...");
    for (const extra of extras) {
        const res = await crearProductoConPrecio(extra);
        console.log(`✔ Extra creado: ${extra.nombre}`);
        console.log("   Product ID:", res.producto.id);
        console.log("   Price ID:", res.price.id);
    }

    console.log("\n🎉 Todo creado correctamente.");
}

main().catch(console.error);
