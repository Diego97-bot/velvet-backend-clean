function pesoPlan(nombre) {
    if (!nombre) return 1;
    const n = nombre.toLowerCase();
    if (n === "vip") return 3;
    if (n === "premium") return 2;
    return 1; // free
}

function pesoExtra(extras) {
    if (!extras || extras.length === 0) {
        return { peso: 0, fecha: null };
    }

    // Detectamos qué extras tiene el anuncio
    let tiene24h = null;
    let tieneBoost = null;
    let tieneAuto = null;

    for (const e of extras) {
        if (e.nombre === "subida_24h") {
            if (!tiene24h || new Date(e.fecha_inicio) > new Date(tiene24h))
                tiene24h = e.fecha_inicio;
        }
        if (e.nombre === "boost_3dias") {
            if (!tieneBoost || new Date(e.fecha_inicio) > new Date(tieneBoost))
                tieneBoost = e.fecha_inicio;
        }
        if (e.nombre.startsWith("auto_subida")) {
            if (!tieneAuto || new Date(e.fecha_inicio) > new Date(tieneAuto))
                tieneAuto = e.fecha_inicio;
        }
    }

    // Jerarquía absoluta:
    // 24h + autosubidas → peso 6
    // 24h → peso 5
    // boost + autosubidas → peso 4
    // boost → peso 3
    // autosubidas → peso 2
    // sin extras → peso 0

    // 24h + autosubidas
    if (tiene24h && tieneAuto) {
        return { peso: 6, fecha: tiene24h };
    }

    // 24h solo
    if (tiene24h) {
        return { peso: 5, fecha: tiene24h };
    }

    // boost + autosubidas
    if (tieneBoost && tieneAuto) {
        return { peso: 4, fecha: tieneBoost };
    }

    // boost solo
    if (tieneBoost) {
        return { peso: 3, fecha: tieneBoost };
    }

    // autosubidas solo
    if (tieneAuto) {
        return { peso: 2, fecha: tieneAuto };
    }

    // sin extras
    return { peso: 0, fecha: null };
}

function ordenarAnuncios(anuncios) {
    return anuncios.sort((a, b) => {
        const planA = pesoPlan(a.plan.nombre);
        const planB = pesoPlan(b.plan.nombre);

        if (planA !== planB) return planB - planA;

        const extraA = pesoExtra(a.extras);
        const extraB = pesoExtra(b.extras);

        if (extraA.peso !== extraB.peso) return extraB.peso - extraA.peso;

        // Si tienen el mismo tipo de extra → gana el más reciente
        if (extraA.fecha && extraB.fecha) {
            return new Date(extraB.fecha) - new Date(extraA.fecha);
        }

        // Si ninguno tiene extras → ordenar por fecha de creación
        return new Date(b.fecha_creado) - new Date(a.fecha_creado);
    });
}

function ordenarHabitaciones(habs) {
    return ordenarAnuncios(habs);
}

module.exports = {
    ordenarAnuncios,
    ordenarHabitaciones
};
