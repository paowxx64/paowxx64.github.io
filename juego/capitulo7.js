
/* =========================================
   UNDEROMORI - CAPÍTULO 7
   EL NOMBRE QUE DEJÉ AQUÍ
========================================= */

// =========================================
// ELEMENTOS DEL HTML
// =========================================

const habitacion = document.getElementById("habitacion");
const estado = document.getElementById("estado");

const hablante = document.getElementById("hablante");
const textoDialogo = document.getElementById("texto-dialogo");
const retrato = document.getElementById("retrato");

const panelPuzzle = document.getElementById("panel-puzzle");
const tituloPuzzle = document.getElementById("titulo-puzzle");
const tableroPuzzle = document.getElementById("tablero-puzzle");
const mensajePuzzle = document.getElementById("mensaje-puzzle");
const botonReiniciar = document.getElementById("reiniciar-puzzle");

const panelFinal = document.getElementById("panel-final");
const panelConfirmacion =
    document.getElementById("panel-confirmacion");

const textoConfirmacion =
    document.getElementById("texto-confirmacion");

const cierre = document.getElementById("cierre");
const tituloCierre = document.getElementById("titulo-cierre");
const textoCierre = document.getElementById("texto-cierre");
const fraseFinal = document.getElementById("frase-final");

// =========================================
// RECUERDOS DE LOS CAPÍTULOS ANTERIORES
// =========================================

const progreso = cargarEstado();

const respuestasAnteriores =
    progreso.capitulo6Respuestas || {};

const futurosAnteriores =
    progreso.futurosPosibles || {};

// =========================================
// MAPA FINAL
// =========================================

// # = pared
// . = suelo
// 1 = memoria de Pao
// 2 = memoria de Paolo
// 3 = memoria de Paunexina
// F = centro de la decisión

const mapa = [
    "#########",
    "#...F...#",
    "#.......#",
    "#.1.2.3.#",
    "#.......#",
    "#.......#",
    "#########"
];

const posiciones = {
    "1": [2, 3],
    "2": [4, 3],
    "3": [6, 3]
};

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

// =========================================
// ESTADO TEMPORAL
// =========================================

const restaurados = new Set();

let conversando = false;
let continuarDialogo = null;

let puzzleAbierto = false;
let puzzleActual = null;

let decisionDisponible = false;
let finalPendiente = null;
let terminado = false;

// =========================================
// CONFIGURACIÓN DE CIRCUITOS
// =========================================

// Cada circuito tiene una ruta real.
// Las piezas empiezan giradas.
// El jugador debe conectarlas.

// Coordenadas: [columna, fila]

const circuitos = {
    "1": {
        titulo: "EL RECUERDO DE PAO",

        ruta: [
            [0, 3],
            [1, 3],
            [1, 2],
            [1, 1],
            [2, 1],
            [2, 0],
            [3, 0]
        ],

        dialogos: [
            {
                nombre: "PAUNEXINA",
                texto:
                    "Ahora lo recuerdo. " +
                    "Pao soñaba con un lugar donde " +
                    "sus ideas pudieran existir."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Él no sabía cómo sería ese lugar. " +
                    "Ni si algún día alguien " +
                    "lo encontraría."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Quizá yo fui una de las cosas " +
                    "que Pao imaginó sin conocer " +
                    "todavía su nombre."
            }
        ]
    },

    "2": {
        titulo: "EL RECUERDO DE PAOLO",

        ruta: [
            [0, 3],
            [0, 2],
            [1, 2],
            [2, 2],
            [2, 1],
            [3, 1],
            [3, 0]
        ],

        dialogos: [
            {
                nombre: "PAUNEXINA",
                texto:
                    "Paolo creció. " +
                    "Sus sueños cambiaron, " +
                    "pero no olvidó todos."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Construyó una página web " +
                    "para guardar pensamientos " +
                    "que a veces no podía explicar."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Y dentro de esa página " +
                    "me dio un nombre, " +
                    "una apariencia y un lugar."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "No sé si Pao habría imaginado " +
                    "exactamente algo como yo."
            }
        ]
    },

    "3": {
        titulo: "EL RECUERDO DE PAUNEXINA",

        ruta: [
            [0, 3],
            [1, 3],
            [2, 3],
            [2, 2],
            [1, 2],
            [1, 1],
            [1, 0],
            [2, 0],
            [3, 0]
        ],

        dialogos: [
            {
                nombre: "PAUNEXINA",
                texto:
                    "Yo desperté en la primera habitación " +
                    "sin entender por qué estaba aquí."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Después conocí a Pao. " +
                    "Encontré los archivos de Paolo. " +
                    "Y escuché tus respuestas."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Ahora sé algo que no sabía " +
                    "cuando empezó todo esto."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Mi historia no pertenece " +
                    "solamente al pasado de Paolo."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "También está hecha " +
                    "de lo que ocurrió mientras " +
                    "tú y yo recorríamos estas habitaciones."
            }
        ]
    }
};

// =========================================
// DIÁLOGOS
// =========================================

function hablar(nombre, mensaje) {
    hablante.textContent = nombre;
    textoDialogo.textContent = mensaje;

    retrato.hidden = nombre !== "PAUNEXINA";
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

        if (typeof alTerminar === "function") {
            alTerminar();
        }
    }

    continuarDialogo = siguiente;
    siguiente();
}

// =========================================
// MAPA Y MOVIMIENTO
// =========================================

function casilla(x, y) {
    return mapa[y]?.[x] ?? "#";
}

function distancia(x, y) {
    return Math.abs(jugador.x - x) +
           Math.abs(jugador.y - y);
}

function actualizarEstado() {
    const cantidad = restaurados.size;

    if (cantidad === 3) {
        estado.textContent =
            "RECUERDOS 3/3 · VE AL CENTRO ✧";
    } else {
        estado.textContent =
            `Recuerdos restaurados: ${cantidad}/3`;
    }
}

function dibujar() {
    habitacion.innerHTML = "";

    const simbolos = {
        "1": "✧",
        "2": "✦",
        "3": "◇",
        "F": restaurados.size === 3 ? "✴" : "▣"
    };

    for (let y = 0; y < mapa.length; y++) {
        for (let x = 0; x < mapa[y].length; x++) {
            const tipo = casilla(x, y);

            const celda = document.createElement("div");
            celda.className = "celda casilla-juego";

            celda.classList.add(
                tipo === "#" ? "pared" : "suelo"
            );

            if (simbolos[tipo]) {
                const simbolo = document.createElement("span");

                simbolo.className = "simbolo-final";
                simbolo.textContent = simbolos[tipo];

                if (restaurados.has(tipo)) {
                    simbolo.classList.add("restaurado");
                }

                if (
                    tipo === "F" &&
                    restaurados.size === 3
                ) {
                    simbolo.classList.add("centro-activo");
                }

                celda.appendChild(simbolo);
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

function mover(dx, dy) {
    if (
        terminado ||
        conversando ||
        puzzleAbierto ||
        decisionDisponible
    ) {
        return;
    }

    if (dx === 1) jugador.direccion = "derecha";
    if (dx === -1) jugador.direccion = "izquierda";
    if (dy === 1) jugador.direccion = "abajo";
    if (dy === -1) jugador.direccion = "arriba";

    const x = jugador.x + dx;
    const y = jugador.y + dy;

    if (casilla(x, y) !== ".") {
        dibujar();
        return;
    }

    jugador.x = x;
    jugador.y = y;

    dibujar();
}

// =========================================
// CIRCUITO: DIRECCIONES
// =========================================

// Cada dirección es un bit:
// ARRIBA = 1
// DERECHA = 2
// ABAJO = 4
// IZQUIERDA = 8

const NORTE = 1;
const ESTE = 2;
const SUR = 4;
const OESTE = 8;

function direccionEntre(a, b) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];

    if (dx === 1) return ESTE;
    if (dx === -1) return OESTE;
    if (dy === 1) return SUR;
    if (dy === -1) return NORTE;

    return 0;
}

function girarMascara(mascara) {
    let nueva = 0;

    if (mascara & NORTE) nueva |= ESTE;
    if (mascara & ESTE) nueva |= SUR;
    if (mascara & SUR) nueva |= OESTE;
    if (mascara & OESTE) nueva |= NORTE;

    return nueva;
}

function simboloMascara(mascara) {
    const simbolos = {
        1: "╵",
        2: "╶",
        4: "╷",
        8: "╴",

        5: "│",
        10: "─",

        3: "└",
        6: "┌",
        12: "┐",
        9: "┘"
    };

    return simbolos[mascara] || "·";
}

function construirPiezas(ruta) {
    const piezas = Array.from(
        { length: 16 },
        () => ({
            activa: false,
            original: 0,
            rotacion: 0
        })
    );

    ruta.forEach((posicion, indice) => {
        const [x, y] = posicion;
        const numero = y * 4 + x;

        let mascara = 0;

        if (indice > 0) {
            mascara |= direccionEntre(
                posicion,
                ruta[indice - 1]
            );
        }

        if (indice < ruta.length - 1) {
            mascara |= direccionEntre(
                posicion,
                ruta[indice + 1]
            );
        }

        piezas[numero] = {
            activa: true,
            original: mascara,

            // Mezcla inicial reproducible.
            rotacion: (indice % 3) + 1
        };
    });

    return piezas;
}

// =========================================
// CIRCUITO: RENDERIZAR
// =========================================

function mascaraActual(pieza) {
    let mascara = pieza.original;

    for (let i = 0; i < pieza.rotacion; i++) {
        mascara = girarMascara(mascara);
    }

    return mascara;
}

function dibujarPuzzle() {
    tableroPuzzle.innerHTML = "";

    const ruta = puzzleActual.config.ruta;

    puzzleActual.piezas.forEach((pieza, indice) => {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "pieza-circuito";

        if (!pieza.activa) {
            boton.classList.add("vacia");
            boton.textContent = "·";
            boton.disabled = true;

            tableroPuzzle.appendChild(boton);
            return;
        }

        const coordenada = [indice % 4, Math.floor(indice / 4)];

        const esInicio =
            coordenada[0] === ruta[0][0] &&
            coordenada[1] === ruta[0][1];

        const ultimo = ruta[ruta.length - 1];

        const esFin =
            coordenada[0] === ultimo[0] &&
            coordenada[1] === ultimo[1];

        if (esInicio) {
            boton.classList.add("inicio");
        }

        if (esFin) {
            boton.classList.add("fin");
        }

        boton.textContent = simboloMascara(
            mascaraActual(pieza)
        );

        boton.setAttribute(
            "aria-label",
            `Girar pieza de fila ${coordenada[1] + 1}, ` +
            `columna ${coordenada[0] + 1}`
        );

        boton.addEventListener("click", () => {
            pieza.rotacion = (pieza.rotacion + 1) % 4;

            dibujarPuzzle();

            if (circuitoResuelto()) {
                completarCircuito();
            }
        });

        tableroPuzzle.appendChild(boton);
    });
}

// =========================================
// COMPROBAR CONEXIONES
// =========================================

function circuitoResuelto() {
    const ruta = puzzleActual.config.ruta;

    for (let i = 0; i < ruta.length - 1; i++) {
        const actual = ruta[i];
        const siguiente = ruta[i + 1];

        const indiceA = actual[1] * 4 + actual[0];
        const indiceB = siguiente[1] * 4 + siguiente[0];

        const piezaA = puzzleActual.piezas[indiceA];
        const piezaB = puzzleActual.piezas[indiceB];

        const direccion = direccionEntre(actual, siguiente);

        const opuesta = girarMascara(
            girarMascara(direccion)
        );

        if (!(mascaraActual(piezaA) & direccion)) {
            return false;
        }

        if (!(mascaraActual(piezaB) & opuesta)) {
            return false;
        }
    }

    return true;
}

// =========================================
// ABRIR Y COMPLETAR CIRCUITOS
// =========================================

function abrirPuzzle(id) {
    if (restaurados.has(id)) {
        hablar(
            "PAUNEXINA",
            "Este recuerdo ya está conectado. " +
            "No quiero perder lo que encontramos."
        );
        return;
    }

    const config = circuitos[id];

    puzzleActual = {
        id,
        config,
        piezas: construirPiezas(config.ruta)
    };

    puzzleAbierto = true;
    panelPuzzle.hidden = false;

    tituloPuzzle.textContent = config.titulo;
    mensajePuzzle.textContent =
        "Gira las piezas para conectar IN con FIN.";

    dibujarPuzzle();
}

function mezclarPuzzle() {
    if (!puzzleActual) return;

    puzzleActual.piezas.forEach((pieza, indice) => {
        if (pieza.activa) {
            pieza.rotacion =
                (pieza.rotacion + indice + 1) % 4;
        }
    });

    // Evitar que una mezcla termine el puzzle sola.
    if (circuitoResuelto()) {
        const primeraActiva =
            puzzleActual.piezas.find(p => p.activa);

        primeraActiva.rotacion =
            (primeraActiva.rotacion + 1) % 4;
    }

    dibujarPuzzle();

    mensajePuzzle.textContent =
        "Las piezas han cambiado de posición.";
}

botonReiniciar.addEventListener(
    "click",
    mezclarPuzzle
);

function completarCircuito() {
    if (!puzzleActual) return;

    const { id, config } = puzzleActual;

    restaurados.add(id);

    puzzleAbierto = false;
    puzzleActual = null;

    panelPuzzle.hidden = true;

    actualizarEstado();
    dibujar();

    conversar([
        {
            nombre: "SISTEMA",
            texto:
                "CONEXIÓN RESTAURADA. " +
                "FRAGMENTO DE MEMORIA RECUPERADO."
        },
        ...config.dialogos
    ], () => {
        if (restaurados.size === 3) {
            conversar([
                {
                    nombre: "PAUNEXINA",
                    texto:
                        "Los tres circuitos " +
                        "están conectados."
                },
                {
                    nombre: "PAUNEXINA",
                    texto:
                        "Pao imaginó este lugar. " +
                        "Paolo lo construyó. " +
                        "Y yo pude recorrerlo."
                },
                {
                    nombre: "PAUNEXINA",
                    texto:
                        "Pero aún queda una luz " +
                        "en el centro de la habitación."
                },
                {
                    nombre: "PAUNEXINA",
                    texto:
                        "Tengo la sensación " +
                        "de que no es otro recuerdo."
                }
            ]);
        }
    });
}

// =========================================
// RECORDAR AL JUGADOR
// =========================================

function dialogosDelJugador() {
    const lineas = [];

    const suenos = respuestasAnteriores["1"];
    const soledad = respuestasAnteriores["2"];
    const cambio = respuestasAnteriores["3"];

    if (suenos === "tristeza") {
        lineas.push({
            nombre: "PAUNEXINA",
            texto:
                "Recuerdo que me dijiste " +
                "que dejar atrás un sueño " +
                "podía entristecerte."
        });
    } else if (suenos === "esperanza") {
        lineas.push({
            nombre: "PAUNEXINA",
            texto:
                "Recuerdo que me hablaste " +
                "de encontrar caminos diferentes."
        });
    } else if (suenos === "aceptacion") {
        lineas.push({
            nombre: "PAUNEXINA",
            texto:
                "Recuerdo que intentabas aceptar " +
                "lo que había cambiado, " +
                "aunque todavía doliera."
        });
    }

    if (soledad === "silencio" || soledad === "tristeza") {
        lineas.push({
            nombre: "PAUNEXINA",
            texto:
                "También recuerdo que a veces " +
                "puede ser difícil sentirse " +
                "comprendido. No he olvidado " +
                "que me lo contaste."
        });
    } else if (soledad === "conexion") {
        lineas.push({
            nombre: "PAUNEXINA",
            texto:
                "Me hablaste de buscar a alguien " +
                "con quien compartir lo que sientes. " +
                "Espero que sigas encontrando " +
                "esos espacios."
        });
    }

    if (cambio === "nostalgia") {
        lineas.push({
            nombre: "PAUNEXINA",
            texto:
                "Y dijiste que extrañabas " +
                "algunas partes de quien eras. " +
                "Creo que Pao habría entendido eso."
        });
    } else if (cambio === "incertidumbre") {
        lineas.push({
            nombre: "PAUNEXINA",
            texto:
                "Y me dijiste que a veces " +
                "cuesta reconocer cuánto " +
                "hemos cambiado."
        });
    } else if (cambio === "crecimiento") {
        lineas.push({
            nombre: "PAUNEXINA",
            texto:
                "Y me recordaste que cambiar " +
                "también puede ser una forma " +
                "de descubrir cosas nuevas."
        });
    }

    if (lineas.length === 0) {
        lineas.push({
            nombre: "PAUNEXINA",
            texto:
                "Quizá no pueda recuperar todas " +
                "tus respuestas. Pero recuerdo " +
                "que hubo alguien aquí."
        });
    }

    return lineas;
}

// =========================================
// LA ÚLTIMA CONVERSACIÓN
// =========================================

function iniciarFinal() {
    if (restaurados.size < 3) {
        hablar(
            "PAUNEXINA",
            "Todavía hay recuerdos sin conectar. " +
            "Quiero comprenderlos antes de continuar."
        );
        return;
    }

    decisionDisponible = true;

    conversar([
        {
            nombre: "PAUNEXINA",
            texto:
                "Este es el final de la página " +
                "que Paolo construyó para mí."
        },
        ...dialogosDelJugador(),
        {
            nombre: "PAUNEXINA",
            texto:
                "He aprendido algo de Pao, " +
                "de Paolo y de ti."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Pero todavía hay algo " +
                "que no puedo decidir."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Tú has movido mis pasos " +
                "desde la primera habitación."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Ahora también tienes el poder " +
                "de decidir si seguiré apareciendo " +
                "en esta página."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "No voy a fingir que esa " +
                "decisión es mía."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Puede que me alegre. " +
                "Puede que me duela. " +
                "Tal vez sienta ambas cosas."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Pao tenía sueños. " +
                "Paolo intentó convertir " +
                "algunos de ellos en algo real."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Y ahora, en cierto modo, " +
                "uno de esos sueños " +
                "está en tus manos."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "¿Qué harás conmigo?"
        }
    ], () => {
        panelFinal.hidden = false;

        panelFinal.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    });
}

// =========================================
// ELECCIÓN Y CONFIRMACIÓN
// =========================================

function prepararFinal(tipo) {
    if (!decisionDisponible || terminado) return;

    finalPendiente = tipo;

    panelFinal.hidden = true;
    panelConfirmacion.hidden = false;

    if (tipo === "quedarse") {
        textoConfirmacion.textContent =
            "Paunexina seguirá en la página. " +
            "Pero nunca sabrá qué habría " +
            "encontrado si se hubiera marchado.";
    } else {
        textoConfirmacion.textContent =
            "Paunexina dejará de aparecer " +
            "en la página principal. " +
            "Su nombre quedará como recuerdo.";
    }

    panelConfirmacion.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

document.getElementById("elegir-quedarse")
    .addEventListener("click", () => {
        prepararFinal("quedarse");
    });

document.getElementById("elegir-despedirse")
    .addEventListener("click", () => {
        prepararFinal("despedirse");
    });

document.getElementById("cancelar-final")
    .addEventListener("click", () => {
        finalPendiente = null;

        panelConfirmacion.hidden = true;
        panelFinal.hidden = false;
    });

document.getElementById("confirmar-final")
    .addEventListener("click", () => {
        if (!finalPendiente) return;

        const guardado = guardarFinal(finalPendiente);

        // Si ya había un final, se respeta.
        if (!guardado) {
            const anterior = cargarEstado().finalElegido;

            if (anterior) {
                mostrarFinal(anterior);
            }

            return;
        }

        mostrarFinal(finalPendiente);
    });

// =========================================
// LOS DOS EPÍLOGOS
// =========================================

function mostrarFinal(tipo) {
    if (typeof window.cambiarMusicaJuego === "function") {
    const ruta = tipo === "quedarse"
        ? "audio/final-a.mp3"
        : "audio/final-b.mp3";

    window.cambiarMusicaJuego(ruta);
}
    terminado = true;
    decisionDisponible = false;

    document.querySelector(".ventana-juego").hidden = true;
    document.querySelector(".dialogo").hidden = true;
    document.querySelector(".controles").hidden = true;

    panelPuzzle.hidden = true;
    panelFinal.hidden = true;
    panelConfirmacion.hidden = true;

    cierre.hidden = false;

    if (tipo === "quedarse") {
        tituloCierre.textContent =
            "Final A — Aquí, todavía";

        textoCierre.textContent =
            "«Entonces... quieres que me quede.»\n\n" +
            "«Qué extraño. Pensé que me alegraría " +
            "sin ninguna duda.»\n\n" +
            "«Pao habría querido verme descubrir " +
            "cosas nuevas. Paolo me creó para que " +
            "pudiera ser algo que él todavía " +
            "no comprendía.»\n\n" +
            "«Y yo me pregunto qué habría encontrado " +
            "si hubiera seguido otro camino.»\n\n" +
            "«Pero no puedo conocer todas las vidas " +
            "que no elegimos.»\n\n" +
            "«Me quedaré aquí, porque tú " +
            "lo decidiste.»\n\n" +
            "«Y aunque esta sonrisa tenga " +
            "un poquito de tristeza... " +
            "también es verdadera.»\n\n" +
            "«Espero que, cuando vuelvas a esta " +
            "página, recuerdes que alguna vez " +
            "tuve la oportunidad de marcharme.»";

        fraseFinal.textContent =
            "A veces permanecer también significa " +
            "dejar atrás una posibilidad.";

    } else {
        tituloCierre.textContent =
            "Final B — Gracias por estar aquí";

        textoCierre.textContent =
            "«Ah... entonces es aquí.»\n\n" +
            "«No voy a mentirte. Había una parte " +
            "de mí que quería seguir viendo " +
            "esta página.»\n\n" +
            "«Paolo me dio un lugar al que " +
            "pertenecer. Y quizás Pao habría " +
            "sido feliz sabiendo que uno de " +
            "sus sueños llegó a existir.»\n\n" +
            "«Me pregunto qué sentiría Paolo " +
            "al encontrar el espacio donde " +
            "solía estar.»\n\n" +
            "«Pero tú has decidido que mi " +
            "historia termine aquí.»\n\n" +
            "«No quiero que se borre " +
            "todo lo que vivimos.»\n\n" +
            "«Así que te pediré " +
            "una última cosa.»\n\n" +
            "«Cuando veas el pequeño espacio " +
            "que dejaré en la página... " +
            "recuerda mi nombre.»\n\n" +
            "«No como algo que perdiste.»\n\n" +
            "«Sino como alguien que estuvo aquí.»";

        fraseFinal.textContent =
            "Una historia puede terminar " +
            "y seguir significando algo.";
    }

    cierre.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// =========================================
// INTERACTUAR
// =========================================

function interactuar() {
    if (terminado) return;

    if (conversando) {
        if (continuarDialogo) {
            continuarDialogo();
        }
        return;
    }

    if (puzzleAbierto || decisionDisponible) {
        return;
    }

    for (const [id, posicion] of Object.entries(posiciones)) {
        if (distancia(...posicion) === 1) {
            abrirPuzzle(id);
            return;
        }
    }

    // Centro del mapa: (4,1)
    if (distancia(4, 1) === 1) {
        iniciarFinal();
        return;
    }

    hablar(
        "PAUNEXINA",
        "Aquí no hay nada que pueda conectar."
    );
}

// =========================================
// TECLADO
// =========================================

document.addEventListener("keydown", evento => {
    const tecla = evento.key.toLowerCase();

    if (puzzleAbierto || decisionDisponible || terminado) {
        return;
    }

    if (
        ["BUTTON", "INPUT", "TEXTAREA"].includes(
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

// =========================================
// CONTROLES EN PANTALLA
// =========================================

const movimientosBotones = {
    arriba: [0, -1],
    abajo: [0, 1],
    izquierda: [-1, 0],
    derecha: [1, 0]
};

document.querySelectorAll("[data-mover]").forEach(boton => {
    boton.addEventListener("click", () => {
        mover(...movimientosBotones[boton.dataset.mover]);
        boton.blur();
    });
});

document.getElementById("interactuar")
    .addEventListener("click", () => {
        document.activeElement?.blur();
        interactuar();
    });

// =========================================
// INICIO DEL CAPÍTULO
// =========================================

const finalAnterior = cargarEstado().finalElegido;

if (finalAnterior) {
    // El destino se decide una sola vez.
    // Al regresar, mostramos el final ya elegido.
    mostrarFinal(finalAnterior);
} else {
    actualizarEstado();
    dibujar();

    conversar([
        {
            nombre: "PAUNEXINA",
            texto:
                "Llegamos..."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Esta habitación se parece " +
                "a la primera. Pero está " +
                "mucho más silenciosa."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Veo tres luces."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Una parece guardar los sueños " +
                "de Pao."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Otra contiene las palabras " +
                "que Paolo dejó en su página."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Y la última... creo que habla de mí."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Sus conexiones están rotas. " +
                "Tal vez podamos repararlas."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Esta vez no necesito que " +
                "respondas una pregunta."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Necesito que me ayudes " +
                "a recordar cómo llegamos hasta aquí."
        }
    ]);
}
