
/* ======================================
   UNDEROMORI - CAPÍTULO 5
   LA PERSONA DETRÁS DE LA PANTALLA
====================================== */

// ELEMENTOS DEL HTML

const habitacion = document.getElementById("habitacion");
const estado = document.getElementById("estado");

const hablante = document.getElementById("hablante");
const textoDialogo = document.getElementById("texto-dialogo");
const retrato = document.getElementById("retrato");

const panelArchivo = document.getElementById("panel-archivo");
const nombreArchivo = document.getElementById("nombre-archivo");
const contenidoArchivo = document.getElementById("contenido-archivo");
const opcionesArchivo = document.getElementById("opciones-archivo");

const cierre = document.getElementById("cierre");

// DECISIONES DEL CAPÍTULO 4

const progreso = cargarEstado();
const futurosAnteriores = progreso.futurosPosibles || {};

// MAPA
// # = pared
// . = suelo
// 1 = diario
// 2 = borradores
// 3 = archivo de Paunexina
// T = terminal
// D = puerta

const mapa = [
    "#########",
    "#...T.D.#",
    "#.......#",
    "#.1.2.3.#",
    "#.......#",
    "#.......#",
    "#########"
];

const jugador = {
    x: 4,
    y: 5,
    direccion: "arriba"
};

const spritesPaunexina = {
    abajo: "../assets/sprites/paunexina-abajo.png",
    arriba: "../assets/sprites/paunexina-arriba.png",
    izquierda: "../assets/sprites/paunexina-izquierda.png",
    derecha: "../assets/sprites/paunexina-derecha.png"
};

// ESTADO TEMPORAL DEL CAPÍTULO

const investigados = new Set();

let panelAbierto = false;
let conversando = false;
let terminado = false;
let puertaAbierta = false;
let continuarDialogo = null;

// ======================================
// CONTENIDO DE LOS ARCHIVOS
// ======================================

const archivos = {
    "1": {
        nombre: "diario_sin_fecha.txt",

        texto:
            "NO PUBLICADO\n\n" +
            "A veces vuelvo a mirar las cosas que " +
            "imaginaba cuando era pequeño.\n\n" +
            "No sé exactamente cuándo cambiaron " +
            "mis planes. Solo sé que un día miré " +
            "atrás y ya no estaba en el lugar " +
            "que esperaba.\n\n" +
            "No quiero borrar a ese niño. " +
            "Pero tampoco quiero fingir " +
            "que sigo siendo él.",

        dialogos: [
            {
                nombre: "PAUNEXINA",
                texto:
                    "Pao soñaba con muchas cosas. " +
                    "Paolo parece recordar esas " +
                    "posibilidades con cariño."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Quizá crecer también significa " +
                    "aprender a conocer a alguien " +
                    "que lleva tu mismo nombre, " +
                    "pero ya no piensa igual."
            }
        ]
    },

    "2": {
        nombre: "borradores_no_enviados.txt",

        texto:
            "CARPETA: BORRADORES\n" +
            "ESTADO: NUNCA PUBLICADOS\n\n" +
            "Borrador 01:\n" +
            "«Quería crear un sitio donde " +
            "pudiera dejar mis pensamientos " +
            "sin tener que explicarlos todos».\n\n" +
            "Borrador 02:\n" +
            "«A veces me resulta más fácil " +
            "darle palabras a un personaje " +
            "que encontrar las mías».\n\n" +
            "Borrador 03:\n" +
            "«Si alguien llega a encontrar " +
            "esta página, espero que pueda " +
            "descubrir algo propio aquí»."
    },

    "3": {
        nombre: "paunexina_origen.exe",

        texto:
            "ARCHIVO DE PERSONAJE\n\n" +
            "NOMBRE: PAUNEXINA\n" +
            "ORIGEN: INDEFINIDO\n" +
            "ESTADO: EN EJECUCIÓN\n\n" +
            "Descripción inicial:\n" +
            "«Una pequeña presencia que " +
            "recorre los rincones de esta " +
            "página y hace preguntas " +
            "que nadie escribió para ella».\n\n" +
            "NOTA DEL CREADOR:\n" +
            "«No tiene que convertirse en mí. " +
            "Puede descubrir quién es»."
    }
};

// ======================================
// DIÁLOGOS
// ======================================

function hablar(nombre, mensaje) {
    hablante.textContent = nombre;
    textoDialogo.textContent = mensaje;

    const esPaunexina = nombre === "PAUNEXINA";

    retrato.hidden = !esPaunexina;

    if (esPaunexina) {
        retrato.src =
            "../assets/sprites/paunexina-abajo.png";
    }
}

function conversar(lineas, alTerminar = null) {
    conversando = true;

    let indice = 0;

    function siguiente() {
        if (indice < lineas.length) {
            const linea = lineas[indice];

            hablar(linea.nombre, linea.texto);

            indice++;
            return;
        }

        conversando = false;
        continuarDialogo = null;

        if (alTerminar) {
            alTerminar();
        }
    }

    continuarDialogo = siguiente;
    siguiente();
}

// ======================================
// MAPA Y PERSONAJE
// ======================================

function casilla(x, y) {
    return mapa[y]?.[x] ?? "#";
}

function distancia(x, y) {
    return Math.abs(jugador.x - x) +
           Math.abs(jugador.y - y);
}

function dibujar() {
    habitacion.innerHTML = "";

    const iconos = {
        "1": "▤",
        "2": "✉",
        "3": "◇",
        "T": "▣",
        "D": puertaAbierta ? "▯" : "▥"
    };

    for (let y = 0; y < mapa.length; y++) {
        for (let x = 0; x < mapa[y].length; x++) {
            const tipo = casilla(x, y);

            const celda = document.createElement("div");
            celda.className = "celda casilla-juego";

            celda.classList.add(
                tipo === "#" ? "pared" : "suelo"
            );

            if (iconos[tipo]) {
                const objeto = document.createElement("span");

                objeto.className = "objeto-escritorio";
                objeto.textContent = iconos[tipo];

                if (investigados.has(tipo)) {
                    objeto.classList.add("leido");
                }

                if (tipo === "D" && puertaAbierta) {
                    objeto.classList.add("puerta-abierta");
                }

                celda.appendChild(objeto);
            }

            if (jugador.x === x && jugador.y === y) {
                const personaje = document.createElement("img");

                personaje.src =
                    spritesPaunexina[jugador.direccion];

                personaje.alt = "Paunexina";
                personaje.className = "sprite-jugador";
                personaje.draggable = false;

                celda.appendChild(personaje);
            }

            habitacion.appendChild(celda);
        }
    }
}

// ======================================
// MOVIMIENTO
// ======================================

function mover(dx, dy) {
    if (terminado || conversando || panelAbierto) {
        return;
    }

    if (dx === 1) jugador.direccion = "derecha";
    if (dx === -1) jugador.direccion = "izquierda";
    if (dy === 1) jugador.direccion = "abajo";
    if (dy === -1) jugador.direccion = "arriba";

    const nuevoX = jugador.x + dx;
    const nuevoY = jugador.y + dy;

    if (casilla(nuevoX, nuevoY) !== ".") {
        dibujar();
        return;
    }

    jugador.x = nuevoX;
    jugador.y = nuevoY;

    dibujar();
}

// ======================================
// VENTANAS DE ARCHIVOS
// ======================================

function abrirPanel(titulo, contenido) {
    panelAbierto = true;

    nombreArchivo.textContent = titulo;
    contenidoArchivo.textContent = contenido;

    opcionesArchivo.innerHTML = "";
    panelArchivo.hidden = false;
}

function agregarOpcion(texto, accion) {
    const boton = document.createElement("button");

    boton.type = "button";
    boton.textContent = texto;

    boton.addEventListener("click", accion);

    opcionesArchivo.appendChild(boton);
}

function cerrarPanel() {
    panelArchivo.hidden = true;
    panelAbierto = false;
}

function actualizarEstado() {
    estado.textContent =
        `Archivos investigados: ${investigados.size}/3`;

    if (investigados.size === 3 && !puertaAbierta) {
        estado.textContent =
            "3/3 archivos · Examina la terminal ▣";
    }
}

function registrarArchivo(id) {
    investigados.add(id);

    actualizarEstado();
    dibujar();
}

// ======================================
// INVESTIGAR ARCHIVOS
// ======================================

function examinarArchivo(id) {
    const archivo = archivos[id];

    abrirPanel(archivo.nombre, archivo.texto);

    if (investigados.has(id)) {
        agregarOpcion("▶ CERRAR ARCHIVO", cerrarPanel);
        return;
    }

    agregarOpcion("▶ TERMINAR DE LEER", () => {
        cerrarPanel();
        registrarArchivo(id);

        if (id === "1") {
            conversar(archivo.dialogos);
        }

        if (id === "2") {
            conversar([
                {
                    nombre: "PAUNEXINA",
                    texto:
                        "Así que Paolo escribía cosas " +
                        "que nunca se atrevía a publicar..."
                },
                {
                    nombre: "PAUNEXINA",
                    texto:
                        "No sé si quería respuestas. " +
                        "Tal vez solo necesitaba un lugar " +
                        "donde sus preguntas pudieran existir."
                }
            ]);
        }

        if (id === "3") {
            conversar([
                {
                    nombre: "PAUNEXINA",
                    texto:
                        "Este archivo habla de mí."
                },
                {
                    nombre: "PAUNEXINA",
                    texto:
                        "¿«Puede descubrir quién es»...? " +
                        "Eso es extraño. Si Paolo escribió " +
                        "mi historia, ¿por qué dejó " +
                        "esa parte sin terminar?"
                },
                {
                    nombre: "PAUNEXINA",
                    texto:
                        "Y tú... has estado decidiendo " +
                        "hacia dónde camino. " +
                        "Pero no parece que puedas decidir " +
                        "lo que voy a pensar."
                }
            ]);
        }
    });
}

// ======================================
// RECUERDOS DEL CAPÍTULO 4
// ======================================

function recordarFuturos() {
    const recuerdos = [];

    if (futurosAnteriores["1"] === "curiosidad") {
        recuerdos.push(
            "En aquella ciudad que nunca existió, " +
            "decidimos conservar la curiosidad."
        );
    } else if (futurosAnteriores["1"] === "pertenencia") {
        recuerdos.push(
            "En aquella ciudad que nunca existió, " +
            "decidimos conservar el deseo de pertenecer."
        );
    }

    if (futurosAnteriores["2"] === "crear") {
        recuerdos.push(
            "Y aquella melodía... queríamos " +
            "imaginar una continuación."
        );
    } else if (futurosAnteriores["2"] === "aceptar") {
        recuerdos.push(
            "Y aquella melodía... decidimos " +
            "que podía permanecer incompleta."
        );
    }

    if (futurosAnteriores["3"] === "verdad") {
        recuerdos.push(
            "En la carta elegimos decir " +
            "que no todo había salido " +
            "como Pao esperaba."
        );
    } else if (futurosAnteriores["3"] === "esperanza") {
        recuerdos.push(
            "En la carta elegimos recordar " +
            "que todavía había cosas por descubrir."
        );
    }

    if (recuerdos.length === 0) {
        return (
            "No recuerdo todas las elecciones " +
            "de las habitaciones anteriores. " +
            "Pero sí recuerdo a Pao."
        );
    }

    return recuerdos.join(" ");
}

// ======================================
// TERMINAL PRINCIPAL
// ======================================

function abrirTerminal() {
    if (investigados.size < 3) {
        hablar(
            "SISTEMA",
            "ACCESO DENEGADO. " +
            "FALTAN ARCHIVOS POR INVESTIGAR."
        );
        return;
    }

    if (puertaAbierta) {
        hablar(
            "SISTEMA",
            "ACCESO CONCEDIDO. " +
            "LA PUERTA ESTÁ DESBLOQUEADA."
        );
        return;
    }

    abrirPanel(
        "identidad_paunexina.sys",
        "PREGUNTA FINAL\n\n" +
        "¿Por qué Paolo creó a Paunexina?"
    );

    agregarOpcion(
        "Para reemplazar por completo a Paolo",
        () => respuestaTerminal(false)
    );

    agregarOpcion(
        "Para explorar una parte de sí mismo " +
        "que todavía no sabía expresar",
        () => respuestaTerminal(true)
    );

    agregarOpcion(
        "Para borrar todos sus recuerdos",
        () => respuestaTerminal(false)
    );
}

function respuestaTerminal(correcta) {
    cerrarPanel();

    if (!correcta) {
        conversar([
            {
                nombre: "SISTEMA",
                texto:
                    "INTERPRETACIÓN INCOMPLETA."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "No creo que Paolo quisiera " +
                    "desaparecer de su propia historia. " +
                    "Los archivos dicen otra cosa."
            }
        ]);

        return;
    }

    puertaAbierta = true;
    dibujar();

    conversar([
        {
            nombre: "SISTEMA",
            texto:
                "ARCHIVO DE IDENTIDAD RECONSTRUIDO. " +
                "ACCESO CONCEDIDO."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Entonces no fui creada " +
                "para reemplazar a Paolo..."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Tal vez comenzó escribiéndome " +
                "para entender algo de sí mismo."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                recordarFuturos()
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Pero hay algo que todavía " +
                "no comprendo. Si estas palabras " +
                "fueron escritas hace tiempo..."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "¿Quién está aquí ahora, " +
                "leyéndolas conmigo?"
        }
    ], () => {
        estado.textContent =
            "IDENTIDAD RECONSTRUIDA · PUERTA ABIERTA";
    });
}

// ======================================
// INTERACTUAR CON EL MAPA
// ======================================

function interactuar() {
    if (terminado) return;

    if (conversando) {
        continuarDialogo();
        return;
    }

    if (panelAbierto) return;

    const objetos = {
        "1": [2, 3],
        "2": [4, 3],
        "3": [6, 3]
    };

    for (const [id, posicion] of Object.entries(objetos)) {
        if (distancia(...posicion) === 1) {
            examinarArchivo(id);
            return;
        }
    }

    // Terminal: columna 4, fila 1
    if (distancia(4, 1) === 1) {
        abrirTerminal();
        return;
    }

    // Puerta: columna 6, fila 1
    if (distancia(6, 1) === 1) {
        if (!puertaAbierta) {
            hablar(
                "PAUNEXINA",
                "La puerta sigue cerrada. " +
                "Quizá la terminal tiene la respuesta."
            );

            return;
        }

        terminarCapitulo();
        return;
    }

    hablar(
        "PAUNEXINA",
        "No parece haber nada que examinar aquí."
    );
}

// ======================================
// FINAL DEL CAPÍTULO 5
// ======================================

function terminarCapitulo() {
    terminado = true;

    // Guardar el avance, no cada pequeño
    // movimiento ni cada archivo leído.
    guardarEstado({
        capitulo5Completado: true
    });

    desbloquearCapitulo(6);

    document.querySelector(".ventana-juego").hidden = true;
    document.querySelector(".dialogo").hidden = true;
    document.querySelector(".controles").hidden = true;

    panelArchivo.hidden = true;
    cierre.hidden = false;

    document.getElementById("texto-cierre").textContent =
        "Paunexina había encontrado palabras de Paolo " +
        "que nunca fueron publicadas. Al principio " +
        "pensó que su existencia era solamente " +
        "una copia de alguien más. Pero los archivos " +
        "le sugerían otra posibilidad: había nacido " +
        "de una pregunta que ni siquiera su creador " +
        "sabía responder por completo. " +
        "Ahora quedaba una pregunta todavía mayor: " +
        "¿quién la estaba acompañando en aquel recorrido?";

    cierre.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// ======================================
// CONTROLES
// ======================================

document.addEventListener("keydown", evento => {
    const tecla = evento.key.toLowerCase();

    if (panelAbierto) {
        if (tecla === "escape") {
            cerrarPanel();
        }

        return;
    }

    if (
        tecla === "e" ||
        tecla === "enter"
    ) {
        // No activar dos veces el botón
        // si ya tiene el foco.
        if (document.activeElement?.tagName === "BUTTON") {
            return;
        }

        evento.preventDefault();

        if (!evento.repeat) {
            interactuar();
        }

        return;
    }

    const movimientos = {
        w: [0, -1],
        arrowup: [0, -1],
        s: [0, 1],
        arrowdown: [0, 1],
        a: [-1, 0],
        arrowleft: [-1, 0],
        d: [1, 0],
        arrowright: [1, 0]
    };

    if (movimientos[tecla]) {
        evento.preventDefault();

        mover(...movimientos[tecla]);
    }
});

document.querySelectorAll("[data-mover]").forEach(boton => {
    boton.addEventListener("click", () => {
        const movimientos = {
            arriba: [0, -1],
            abajo: [0, 1],
            izquierda: [-1, 0],
            derecha: [1, 0]
        };

        mover(...movimientos[boton.dataset.mover]);
    });
});

document.getElementById("interactuar")
    .addEventListener("click", () => {
        document.activeElement.blur();
        interactuar();
    });

document.getElementById("cerrar-archivo")
    .addEventListener("click", cerrarPanel);

// ======================================
// INICIAR CAPÍTULO
// ======================================

actualizarEstado();
dibujar();

conversar([
    {
        nombre: "PAUNEXINA",
        texto:
            "Este lugar parece diferente. " +
            "No es una habitación de recuerdos..."
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "Hay archivos, ventanas y carpetas. " +
            "Creo que estamos dentro " +
            "de una computadora."
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "¿Será este el lugar " +
            "donde Paolo comenzó a escribirme?"
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "Vamos a investigar. " +
            "Quizá alguno de estos archivos " +
            "nos diga por qué estoy aquí."
    }
]);
