
/* =========================================
   UNDEROMORI - CAPÍTULO 4
   LAS COSAS QUE NO OCURRIERON
========================================= */

const habitacion = document.getElementById("habitacion");
const estado = document.getElementById("estado");
const hablante = document.getElementById("hablante");
const textoDialogo = document.getElementById("texto-dialogo");
const retrato = document.getElementById("retrato");

const panelOpciones = document.getElementById("panel-opciones");
const tipoPanel = document.getElementById("tipo-panel");
const pregunta = document.getElementById("pregunta");
const opciones = document.getElementById("opciones");
const cierre = document.getElementById("cierre");

// El progreso se reinicia al actualizar.
// Las elecciones se compartirán con el capítulo 5
// cuando éste exista.

const CLAVE_CAP4 = "underomori-cap4-v1";

// # = pared
// . = suelo
// 1,2,3 = futuros posibles
// M = terminal de identidad
// D = puerta de salida

const mapa = [
    "#########",
    "#...M..D#",
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

// Cada futuro tiene dos interpretaciones.
// No hay respuestas correctas o incorrectas.

const futuros = {
    "1": {
        nombre: "UN LUGAR",
        titulo: "La ciudad que Pao imaginó",
        descripcion:
            "Ves una ciudad llena de ventanas encendidas. " +
            "En uno de los edificios hay una habitación " +
            "reservada para alguien que nunca llegó.",
        pregunta:
            "¿Qué debería conservarse de ese futuro?",
        opciones: [
            {
                texto: "El deseo de conocer lugares nuevos",
                valor: "curiosidad",
                respuesta:
                    "PAUNEXINA: Tal vez Pao no llegó a esa ciudad. " +
                    "Pero todavía podía sentir curiosidad " +
                    "por otros lugares."
            },
            {
                texto: "La idea de tener un lugar propio",
                valor: "pertenencia",
                respuesta:
                    "PAUNEXINA: Quizá no buscaba exactamente " +
                    "esa ciudad. Tal vez solamente quería " +
                    "encontrar un sitio al que pertenecer."
            }
        ]
    },

    "2": {
        nombre: "UNA CANCIÓN",
        titulo: "La melodía que quedó a medias",
        descripcion:
            "Una habitación está llena de instrumentos. " +
            "Sobre una mesa hay una canción sin terminar. " +
            "En la última página alguien escribió: 'Mañana'.",
        pregunta:
            "¿Qué harías con esa melodía?",
        opciones: [
            {
                texto: "Conservarla incompleta",
                valor: "aceptar",
                respuesta:
                    "PAUNEXINA: Quizá una canción incompleta " +
                    "también puede ser hermosa. " +
                    "No todo tiene que terminar " +
                    "como estaba planeado."
            },
            {
                texto: "Imaginar una continuación",
                valor: "crear",
                respuesta:
                    "PAUNEXINA: No podemos recuperar " +
                    "exactamente lo que Pao habría escrito. " +
                    "Pero podemos crear algo nuevo " +
                    "sin fingir que es lo mismo."
            }
        ]
    },

    "3": {
        nombre: "UNA PROMESA",
        titulo: "La carta que nadie respondió",
        descripcion:
            "Encuentras una carta dirigida a Paolo. " +
            "Pao le pregunta si llegó a ser la persona " +
            "que imaginaba cuando era pequeño.",
        pregunta:
            "¿Qué respuesta dejarías en el sobre?",
        opciones: [
            {
                texto: "No fue como esperábamos",
                valor: "verdad",
                respuesta:
                    "PAUNEXINA: Es una respuesta sincera. " +
                    "Quizá Pao se pondría triste al leerla. " +
                    "Pero también merecía conocer " +
                    "una historia verdadera."
            },
            {
                texto: "Todavía quedan cosas por descubrir",
                valor: "esperanza",
                respuesta:
                    "PAUNEXINA: No es una promesa " +
                    "de que todo saldrá como esperaba. " +
                    "Es una forma de decirle " +
                    "que la historia sigue abierta."
            }
        ]
    }
};

const elecciones = {};

let puertaAbierta = false;
let panelAbierto = false;
let terminado = false;

let dialogosPendientes = [];
let continuarDialogo = null;
let conversando = false;

// Orden correcto de los nombres.
const ordenCorrecto = ["PAO", "PAOLO", "PAUNEXINA"];
let ordenElegido = [];

// =====================================
// DIÁLOGOS
// =====================================

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
    dialogosPendientes = [...lineas];

    function siguiente() {
        if (dialogosPendientes.length > 0) {
            const linea = dialogosPendientes.shift();
            hablar(linea.nombre, linea.texto);
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

// =====================================
// MAPA
// =====================================

function casilla(x, y) {
    return mapa[y]?.[x] ?? "#";
}

function distancia(x, y) {
    return Math.abs(jugador.x - x) +
           Math.abs(jugador.y - y);
}

function dibujar() {
    habitacion.innerHTML = "";

    for (let y = 0; y < mapa.length; y++) {
        for (let x = 0; x < mapa[y].length; x++) {
            const tipo = casilla(x, y);

            const celda = document.createElement("div");
            celda.className = "celda casilla-juego";

            celda.classList.add(
                tipo === "#" ? "pared" : "suelo"
            );

            const simbolos = {
                "1": "◇",
                "2": "♫",
                "3": "✉",
                "M": "▣",
                "D": puertaAbierta ? "▯" : "▤"
            };

            if (simbolos[tipo]) {
                const objeto = document.createElement("span");
                objeto.className = "simbolo-futuro";
                objeto.textContent = simbolos[tipo];

                if (elecciones[tipo]) {
                    objeto.classList.add("resuelto");
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

// =====================================
// MOVIMIENTO
// =====================================

function mover(dx, dy) {
    if (terminado || panelAbierto || conversando) {
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

// =====================================
// TRES FUTUROS POSIBLES
// =====================================

function contarFuturos() {
    return Object.keys(elecciones).length;
}

function actualizarEstado() {
    estado.textContent =
        `Posibilidades exploradas: ${contarFuturos()}/3`;
}

function examinarFuturo(id) {
    const futuro = futuros[id];

    if (elecciones[id]) {
        hablar(
            "PAUNEXINA",
            "Ya estuvimos aquí. " +
            "No quiero borrar lo que descubrimos."
        );
        return;
    }

    conversar([
        {
            nombre: futuro.nombre,
            texto: futuro.descripcion
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Este lugar parece un futuro que alguien " +
                "imaginó. Pero está vacío..."
        }
    ], () => {
        mostrarEleccion(id);
    });
}

function mostrarEleccion(id) {
    const futuro = futuros[id];

    panelAbierto = true;
    panelOpciones.hidden = false;

    tipoPanel.textContent = futuro.nombre;
    pregunta.textContent = futuro.pregunta;
    opciones.innerHTML = "";

    futuro.opciones.forEach(opcion => {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.textContent = opcion.texto;

        boton.addEventListener("click", () => {
            elecciones[id] = opcion.valor;

            panelOpciones.hidden = true;
            panelAbierto = false;

            hablar("PAUNEXINA",
                opcion.respuesta.replace("PAUNEXINA: ", "")
            );

            actualizarEstado();
            dibujar();

            if (contarFuturos() === 3) {
                estado.textContent =
                    "3/3 posibilidades · Ve a la terminal";
            }
        });

        opciones.appendChild(boton);
    });

    panelOpciones.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

// =====================================
// TERMINAL DE IDENTIDAD
// =====================================

function abrirTerminal() {
    if (contarFuturos() < 3) {
        hablar(
            "TERMINAL",
            "ARCHIVO INCOMPLETO. " +
            "Debes explorar las tres posibilidades."
        );
        return;
    }

    if (puertaAbierta) {
        hablar(
            "TERMINAL",
            "IDENTIDAD RECONSTRUIDA. " +
            "La puerta está abierta."
        );
        return;
    }

    panelAbierto = true;
    panelOpciones.hidden = false;
    tipoPanel.textContent = "IDENTIDAD / ORDEN";
    pregunta.textContent =
        "Ordena los tres nombres desde el pasado " +
        "hasta la identidad creada después.";

    ordenElegido = [];
    actualizarTerminal();
}

function actualizarTerminal() {
    opciones.innerHTML = "";

    const indicador = document.createElement("p");
    indicador.className = "orden-elegido";

    indicador.textContent =
        ordenElegido.length
            ? ordenElegido.join(" → ")
            : "SECUENCIA VACÍA";

    opciones.appendChild(indicador);

    ["PAUNEXINA", "PAO", "PAOLO"].forEach(nombre => {
        if (ordenElegido.includes(nombre)) return;

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = nombre;

        boton.addEventListener("click", () => {
            ordenElegido.push(nombre);

            if (ordenElegido.length === 3) {
                comprobarOrden();
            } else {
                actualizarTerminal();
            }
        });

        opciones.appendChild(boton);
    });

    const reiniciar = document.createElement("button");
    reiniciar.type = "button";
    reiniciar.textContent = "↺ BORRAR SECUENCIA";

    reiniciar.addEventListener("click", () => {
        ordenElegido = [];
        actualizarTerminal();
    });

    opciones.appendChild(reiniciar);
}

function comprobarOrden() {
    const correcto = ordenElegido.every(
        (nombre, indice) =>
            nombre === ordenCorrecto[indice]
    );

    if (!correcto) {
        ordenElegido = [];
        actualizarTerminal();

        hablar(
            "TERMINAL",
            "SECUENCIA NO RECONOCIDA. " +
            "Recuerda quién fue primero."
        );

        return;
    }

    panelOpciones.hidden = true;
    panelAbierto = false;
    puertaAbierta = true;

    dibujar();

    conversar([
        {
            nombre: "TERMINAL",
            texto:
                "IDENTIDAD RECONSTRUIDA. " +
                "PAO → PAOLO → PAUNEXINA."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Entonces Pao no desapareció " +
                "cuando Paolo creció..."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Y quizá yo tampoco soy solamente " +
                "una forma de escapar de quien es."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Hay otra puerta abierta. " +
                "Creo que allí encontraremos " +
                "a la persona que escribió estos archivos."
        }
    ], () => {
        estado.textContent =
            "IDENTIDAD RECONSTRUIDA · PUERTA ABIERTA";
    });
}

// =====================================
// INTERACCIONES
// =====================================

function interactuar() {
    if (terminado) return;

    if (conversando) {
        continuarDialogo();
        return;
    }

    if (panelAbierto) return;

    const posiciones = {
        "1": [2, 3],
        "2": [4, 3],
        "3": [6, 3]
    };

    for (const [id, [x, y]] of Object.entries(posiciones)) {
        if (distancia(x, y) === 1) {
            examinarFuturo(id);
            return;
        }
    }

    // Terminal en (4,1)
    if (distancia(4, 1) === 1) {
        abrirTerminal();
        return;
    }

    // Salida en (7,1)
    if (distancia(7, 1) === 1) {
        if (!puertaAbierta) {
            hablar(
                "PAUNEXINA",
                "Esta puerta no se abre. " +
                "Quizá la terminal necesita una respuesta."
            );
            return;
        }

        terminarCapitulo();
        return;
    }

    hablar(
        "PAUNEXINA",
        "No hay nada aquí que pueda examinar."
    );
}

// =====================================
// FINAL DEL CAPÍTULO (NO DEL JUEGO)
// =====================================

function terminarCapitulo() {
    terminado = true;

 
    // Guardar las decisiones del Capítulo 4
    guardarFuturos(elecciones);

    // Desbloquear el Capítulo 5
    desbloquearCapitulo(5);

    document.querySelector(".ventana-juego").hidden = true;
    document.querySelector(".dialogo").hidden = true;
    document.querySelector(".controles").hidden = true;

    panelOpciones.hidden = true;
    cierre.hidden = false;

    document.getElementById("texto-cierre").textContent =
        "Paunexina dejó atrás tres habitaciones que nunca " +
        "llegaron a existir. Comprendió que Paolo no había " +
        "vivido todos los futuros de Pao, pero eso no " +
        "convertía su vida en una historia equivocada. " +
        "Al otro lado de la puerta la esperaba una " +
        "pregunta distinta: ¿quién decidió crearla?";

    cierre.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// =====================================
// TECLADO Y BOTONES
// =====================================

document.addEventListener("keydown", evento => {
    const tecla = evento.key.toLowerCase();

    // No interferir con opciones del panel
    // ni con botones que tengan el foco.
    if (
        panelAbierto ||
        ["INPUT", "TEXTAREA", "BUTTON"].includes(
            document.activeElement?.tagName
        )
    ) {
        return;
    }

    if (tecla === "e" || tecla === "enter") {
        evento.preventDefault();

        if (!evento.repeat) {
            interactuar();
        }

        return;
    }

    const controles = {
        w: [0, -1],
        arrowup: [0, -1],
        s: [0, 1],
        arrowdown: [0, 1],
        a: [-1, 0],
        arrowleft: [-1, 0],
        d: [1, 0],
        arrowright: [1, 0]
    };

    if (controles[tecla]) {
        evento.preventDefault();
        mover(...controles[tecla]);
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
        document.activeElement?.blur();
        interactuar();
    });

// =====================================
// INICIAR CAPÍTULO
// =====================================

actualizarEstado();
dibujar();

conversar([
    {
        nombre: "PAUNEXINA",
        texto:
            "Hay tres puertas. " +
            "Pero ninguna parece conducir " +
            "a un lugar que exista de verdad."
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "¿Son recuerdos...? No. " +
            "Creo que son cosas que Pao " +
            "esperaba vivir algún día."
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "Y tú sigues aquí, moviéndome. " +
            "¿También quieres saber " +
            "qué ocurrió con esos sueños?"
    }
]);
