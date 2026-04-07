function pesoPlan(nombre) {
    if (!nombre) return 1;
    const n = nombre.toLowerCase();
    if (n === "vip") return 3;
    if (n === "premium") return 2;
    return 1;
}

function pesoExtra(extras) {
    if (!extras || extras.length === 0) {
        return { peso: 0, fecha: null };
    }

    let mejor = { peso: 0, fecha: null };

    for (const e of extras) {
        let peso = 0;

        if (e.nombre === "boost_3dias") peso = 3;
        if (e.nombre === "subida_24h") peso = 2;
        if (e.nombre === "auto_subida_6h") peso = 1;

        // Si este extra tiene más peso → gana
        if (peso > mejor.peso) {
            mejor = { peso, fecha: e.fecha_inicio };
        }

        // Si tiene el mismo peso → gana el más reciente
        if (peso === mejor.peso) {
            if (e.fecha_inicio && (!mejor.fecha || new Date(e.fecha_inicio) > new Date(mejor.fecha))) {
                mejor = { peso, fecha: e.fecha_inicio };
            }
        }
    }

    return mejor;
}


function ordenarAnuncios(anuncios) {
    return anuncios.sort((a, b) => {
        const planA = pesoPlan(a.plan.nombre);
        const planB = pesoPlan(b.plan.nombre);

        if (planA !== planB) return planB - planA;

        const extraA = pesoExtra(a.extras);
        const extraB = pesoExtra(b.extras);

        if (extraA.peso !== extraB.peso) return extraB.peso - extraA.peso;

        // Si tienen el mismo extra → ordenar por fecha de mejora
        if (extraA.fecha && extraB.fecha) {
            return new Date(extraB.fecha) - new Date(extraA.fecha);
        }

        // Si ninguno tiene extras → ordenar por fecha de creación
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

        if (extraA.peso !== extraB.peso) return extraB.peso - extraA.peso;

        if (extraA.fecha && extraB.fecha) {
            return new Date(extraB.fecha) - new Date(extraA.fecha);
        }

        return new Date(b.fecha_creado) - new Date(a.fecha_creado);
    });
}

module.exports = {
    ordenarAnuncios,
    ordenarHabitaciones
};
