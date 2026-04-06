function pesoPlan(nombre) {
    if (!nombre) return 1;
    const n = nombre.toLowerCase();
    if (n === "vip") return 3;
    if (n === "premium") return 2;
    return 1;
}

function pesoExtra(extras) {
    const nombres = extras.map(e => e.nombre);

    if (nombres.includes("boost_3dias")) return 3;
    if (nombres.includes("subida_24h")) return 2;
    if (nombres.includes("auto_subida_6h")) return 1;

    return 0;
}


function ordenarAnuncios(anuncios) {
    return anuncios.sort((a, b) => {
        const planA = pesoPlan(a.plan.nombre);
        const planB = pesoPlan(b.plan.nombre);

        if (planA !== planB) return planB - planA;

        const extraA = pesoExtra(a.extras);
        const extraB = pesoExtra(b.extras);

        if (extraA !== extraB) return extraB - extraA;

        return new Date(b.fecha_creado) - new Date(a.fecha_creado);
    });
}

function ordenarHabitaciones(habs) {
    return habs.sort((a, b) => {
        const planA = pesoPlan(a.plan.nombre);
        const planB = pesoPlan(b.plan.nombre);

        if (planA !== planB) return planB - planA;

        const extraA = pesoExtra(a.extras);
        const extraB = pesoExtra(b.extras);

        if (extraA !== extraB) return extraB - extraA;

        return new Date(b.fecha_creado) - new Date(a.fecha_creado);
    });
}

module.exports = {
    ordenarAnuncios,
    ordenarHabitaciones
};
