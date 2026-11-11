
/* =====================================
   UNDEROMORI - SISTEMA DE PROGRESO
===================================== */

const CLAVE_ESTADO = "underomori-estado-v1";

const estadoInicial = {
    capituloDesbloqueado: 1,
    recuerdosPao: {},
    futurosPosibles: {},
    finalElegido: null
};

// Leer el progreso
function cargarEstado() {
    try {
        const guardado = localStorage.getItem(CLAVE_ESTADO);

        if (guardado) {
            return {
                ...estadoInicial,
                ...JSON.parse(guardado)
            };
        }
    } catch (error) {
        console.warn("No se pudo cargar el progreso.");
    }

    return { ...estadoInicial };
}

// Guardar el progreso
function guardarEstado(nuevosDatos) {
    const estadoActual = cargarEstado();

    const estadoActualizado = {
        ...estadoActual,
        ...nuevosDatos
    };

    try {
        localStorage.setItem(
            CLAVE_ESTADO,
            JSON.stringify(estadoActualizado)
        );
    } catch (error) {
        console.warn("No se pudo guardar el progreso.");
    }

    return estadoActualizado;
}

// Desbloquear un capítulo
function desbloquearCapitulo(numero) {
    const estadoActual = cargarEstado();

    guardarEstado({
        capituloDesbloqueado: Math.max(
            estadoActual.capituloDesbloqueado,
            numero
        )
    });
}

// Guardar elecciones importantes
function guardarRecuerdos(recuerdos) {
    guardarEstado({
        recuerdosPao: recuerdos
    });
}

function guardarFuturos(futuros) {
    guardarEstado({
        futurosPosibles: futuros
    });
}

// Guardar únicamente el final definitivo
function guardarFinal(final) {
    const estadoActual = cargarEstado();

    if (estadoActual.finalElegido !== null) {
        return false;
    }

    guardarEstado({
        finalElegido: final
    });

    return true;
}
