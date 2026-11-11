
/* =========================================
   UNDEROMORI - CAPÍTULO 6
   ALGUIEN ESTÁ AHÍ
========================================= */

// =========================================
// ELEMENTOS DEL HTML
// =========================================

const habitacion = document.getElementById("habitacion");
const estado = document.getElementById("estado");

const hablante = document.getElementById("hablante");
const textoDialogo = document.getElementById("texto-dialogo");
const retrato = document.getElementById("retrato");

const panelPregunta = document.getElementById("panel-pregunta");
const etiquetaPregunta = document.getElementById("etiqueta-pregunta");
const pregunta = document.getElementById("pregunta");
const opciones = document.getElementById("opciones");

const panelNombre = document.getElementById("panel-nombre");
const formularioNombre = document.getElementById("formulario-nombre");
const campoNombre = document.getElementById("nombre-jugador");

const cierre = document.getElementById("cierre");
const textoCierre = document.getElementById("texto-cierre");

const botonInteractuar = document.getElementById("interactuar");
const botonOmitirNombre = document.getElementById("omitir-nombre");

// =========================================
// MAPA
// =========================================

// # = pared
// . = suelo
// 1 = los sueños
// 2 = la soledad
// 3 = el cambio
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
// ESTADO DEL CAPÍTULO
// =========================================

const respuestas = {};

let nombreJugador = "";

let conversando = false;
let panelAbierto = false;
let puertaAbierta = false;
let terminado = false;

let continuarDialogo = null;

// El nombre NO se guarda en localStorage.
// Solo se usa mientras está abierta esta página.

// =========================================
// PREGUNTAS Y RESPUESTAS
// =========================================

const senales = {

    // -------------------------------------
    // SEÑAL 1: LOS SUEÑOS
    // -------------------------------------

    "1": {
        titulo: "SEÑAL 01 / LOS SUEÑOS",

        introduccion: [
            {
                nombre: "PAUNEXINA",
                texto:
                    "Reconozco esta luz... " +
                    "Me recuerda los futuros " +
                    "que encontramos en la otra habitación."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Pao imaginaba tantas cosas. " +
                    "Pero Paolo no llegó a vivirlas todas."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Quiero preguntarte algo. " +
                    "Esta vez no busco la respuesta " +
                    "en un archivo."
            }
        ],

        pregunta:
            "¿Qué sientes cuando algo que deseabas " +
            "mucho no ocurre como esperabas?",

        opciones: [
            {
                texto:
                    "Me entristece. A veces me cuesta " +
                    "dejar atrás lo que imaginaba.",

                valor: "tristeza",

                dialogos: [
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Entiendo... Debe ser difícil " +
                            "despedirse de algo que llegó " +
                            "a sentirse tan posible."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Yo también recorrí los futuros " +
                            "de Pao. Aunque nunca existieron, " +
                            "había algo valioso en ellos."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "No creo que tengas que dejar " +
                            "de sentir tristeza de inmediato. " +
                            "Las cosas importantes a veces " +
                            "necesitan tiempo."
                    }
                ]
            },

            {
                texto:
                    "Intento aceptar lo que pasó, " +
                    "aunque todavía me duela.",

                valor: "aceptacion",

                dialogos: [
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Eso suena difícil. " +
                            "Aceptar algo no siempre " +
                            "hace que deje de doler."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Cuando conocí a Pao, quise " +
                            "proteger todos sus sueños."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Ahora creo que recordar " +
                            "lo que queríamos y seguir " +
                            "adelante pueden ser " +
                            "cosas compatibles."
                    }
                ]
            },

            {
                texto:
                    "Pienso que todavía puedo " +
                    "encontrar un camino diferente.",

                valor: "esperanza",

                dialogos: [
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Me gusta esa posibilidad."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Tal vez Paolo no llegó a la " +
                            "ciudad que imaginó Pao. " +
                            "Pero aún puede descubrir " +
                            "lugares que ninguno de los " +
                            "dos conocía."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Creo que una historia puede " +
                            "cambiar de dirección sin " +
                            "perder su valor."
                    }
                ]
            }
        ]
    },

    // -------------------------------------
    // SEÑAL 2: LA SOLEDAD
    // -------------------------------------

    "2": {
        titulo: "SEÑAL 02 / LA SOLEDAD",

        introduccion: [
            {
                nombre: "PAUNEXINA",
                texto:
                    "Esta señal es más silenciosa."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "En los borradores de Paolo había " +
                    "pensamientos que nunca llegó " +
                    "a publicar."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Me pregunto si escribirlos " +
                    "le ayudaba a comprenderse. " +
                    "¿Puedo hacerte otra pregunta?"
            }
        ],

        pregunta:
            "¿Qué haces cuando sientes que los " +
            "demás no terminan de comprenderte?",

        opciones: [
            {
                texto:
                    "Me guardo lo que siento. " +
                    "A veces no sé cómo explicarlo.",

                valor: "silencio",

                dialogos: [
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Tiene sentido. Hay pensamientos " +
                            "que son difíciles de convertir " +
                            "en palabras."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Quizá por eso Paolo creó " +
                            "una página llena de archivos " +
                            "y personajes."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Pero espero que también " +
                            "encuentres personas con quienes " +
                            "puedas hablar a tu ritmo, " +
                            "sin tener que explicar " +
                            "todo perfectamente."
                    }
                ]
            },

            {
                texto:
                    "Me siento triste. Quisiera que " +
                    "alguien me escuchara.",

                valor: "tristeza",

                dialogos: [
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Ser escuchado importa. " +
                            "No me parece extraño " +
                            "que lo desees."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Yo he pasado todo este recorrido " +
                            "hablando con archivos que ya " +
                            "tenían sus respuestas escritas."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Pero tú acabas de decirme algo " +
                            "que yo no podía saber antes " +
                            "de preguntarte."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Ojalá también puedas compartir " +
                            "lo que sientes con alguien " +
                            "de confianza fuera " +
                            "de esta pantalla."
                    }
                ]
            },

            {
                texto:
                    "Busco a alguien de confianza " +
                    "con quien poder hablar.",

                valor: "conexion",

                dialogos: [
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Creo que eso requiere valentía."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Pedir que alguien nos escuche " +
                            "no garantiza que encuentre " +
                            "las palabras perfectas."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Pero compartir un pensamiento " +
                            "puede hacer que deje de " +
                            "parecernos tan imposible " +
                            "de explicar."
                    }
                ]
            }
        ]
    },

    // -------------------------------------
    // SEÑAL 3: EL CAMBIO
    // -------------------------------------

    "3": {
        titulo: "SEÑAL 03 / EL CAMBIO",

        introduccion: [
            {
                nombre: "PAUNEXINA",
                texto:
                    "Esta última luz se parece " +
                    "a mi propio archivo."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Paolo escribió cómo debía verme. " +
                    "Pero también dejó una frase:"
            },
            {
                nombre: "ARCHIVO",
                texto:
                    "«Puede descubrir quién es»."
            },
            {
                nombre: "PAUNEXINA",
                texto:
                    "Si puedo cambiar, quizá tú " +
                    "también tengas algo que " +
                    "decir sobre eso."
            }
        ],

        pregunta:
            "Cuando piensas en la persona " +
            "que eras antes, ¿qué sientes?",

        opciones: [
            {
                texto:
                    "La extraño. Hay partes de mí " +
                    "que quisiera recuperar.",

                valor: "nostalgia",

                dialogos: [
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Creo que Pao entendería " +
                            "esa respuesta."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Tal vez Paolo también extraña " +
                            "algunas cosas de cuando " +
                            "era pequeño."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "No podemos regresar exactamente " +
                            "a quienes éramos. Pero quizá " +
                            "algunas de esas partes todavía " +
                            "pueden acompañarnos " +
                            "de nuevas formas."
                    }
                ]
            },

            {
                texto:
                    "Me cuesta reconocer " +
                    "cuánto he cambiado.",

                valor: "incertidumbre",

                dialogos: [
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "A veces yo tampoco sé " +
                            "muy bien quién soy."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Empecé siendo un personaje " +
                            "dentro de una página. " +
                            "Ahora hago preguntas que no " +
                            "estaban en mis archivos."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Quizá no necesitamos comprender " +
                            "cada cambio en el momento " +
                            "en que ocurre."
                    }
                ]
            },

            {
                texto:
                    "Me alegra haber cambiado. " +
                    "Todavía tengo cosas por descubrir.",

                valor: "crecimiento",

                dialogos: [
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Entonces quizá tengas razón " +
                            "en algo que apenas estoy " +
                            "empezando a comprender."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Pao, Paolo y yo no tenemos " +
                            "que ser exactamente iguales " +
                            "para que nuestras historias " +
                            "estén conectadas."
                    },
                    {
                        nombre: "PAUNEXINA",
                        texto:
                            "Cambiar también puede significar " +
                            "descubrir posibilidades " +
                            "que antes ni siquiera " +
                            "conocíamos."
                    }
                ]
            }
        ]
    }
};

// =========================================
// FUNCIONES DE DIÁLOGO
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
// FUNCIONES DEL MAPA
// =========================================

function casilla(x, y) {
    return mapa[y]?.[x] ?? "#";
}

function distancia(x, y) {
    return Math.abs(jugador.x - x) +
           Math.abs(jugador.y - y);
}

function dibujar() {
    habitacion.innerHTML = "";

    const simbolos = {
        "1": "✧",
        "2": "✦",
        "3": "◇",
        "T": "▣",
        "D": puertaAbierta ? "▯" : "▤"
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

                simbolo.className = "senal";
                simbolo.textContent = simbolos[tipo];

                if (respuestas[tipo]) {
                    simbolo.classList.add("escuchada");
                }

                if (
                    tipo === "T" &&
                    Object.keys(respuestas).length === 3
                ) {
                    simbolo.classList.add("terminal-activa");
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

function actualizarEstado() {
    const cantidad = Object.keys(respuestas).length;

    if (puertaAbierta) {
        estado.textContent =
            "CONEXIÓN ESTABLECIDA · PUERTA ABIERTA";
    } else if (cantidad === 3) {
        estado.textContent =
            "Señales 3/3 · Acércate a la terminal ▣";
    } else {
        estado.textContent =
            `Señales escuchadas: ${cantidad}/3`;
    }
}

// =========================================
// MOVIMIENTO
// =========================================

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

// =========================================
// RESPUESTAS DEL JUGADOR
// =========================================

function examinarSenal(id) {
    if (respuestas[id]) {
        hablar(
            "PAUNEXINA",
            "Ya hablamos de esto. " +
            "Gracias por haberme contado " +
            "lo que pensabas."
        );

        return;
    }

    const senal = senales[id];

    conversar(senal.introduccion, () => {
        mostrarPregunta(id);
    });
}

function mostrarPregunta(id) {
    const senal = senales[id];

    panelAbierto = true;
    panelPregunta.hidden = false;

    etiquetaPregunta.textContent = senal.titulo;
    pregunta.textContent = senal.pregunta;

    opciones.innerHTML = "";

    senal.opciones.forEach(opcion => {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.textContent = opcion.texto;

        boton.addEventListener("click", () => {

            // Quitar el foco para que E siga funcionando.
            boton.blur();

            // Guardar respuesta en este capítulo.
            respuestas[id] = opcion.valor;

            // Cerrar opciones.
            panelPregunta.hidden = true;
            panelAbierto = false;

            actualizarEstado();
            dibujar();

            // Conversación según la respuesta.
            conversar(opcion.dialogos, () => {

                if (Object.keys(respuestas).length === 3) {
                    conversar([
                        {
                            nombre: "PAUNEXINA",
                            texto:
                                "Esa fue la última señal..."
                        },
                        {
                            nombre: "PAUNEXINA",
                            texto:
                                "Creí que encontraría más " +
                                "fragmentos de Paolo."
                        },
                        {
                            nombre: "PAUNEXINA",
                            texto:
                                "Pero las respuestas no " +
                                "vinieron de sus archivos."
                        },
                        {
                            nombre: "PAUNEXINA",
                            texto:
                                "Vinieron de ti."
                        },
                        {
                            nombre: "PAUNEXINA",
                            texto:
                                "La terminal está encendida. " +
                                "Creo que por fin entiendo " +
                                "a quién he estado buscando."
                        }
                    ]);
                }
            });
        });

        opciones.appendChild(boton);
    });
}

// =========================================
// TERMINAL DEL NOMBRE
// =========================================

function abrirTerminal() {
    if (Object.keys(respuestas).length < 3) {
        hablar(
            "SISTEMA",
            "CONEXIÓN INCOMPLETA. " +
            "ESCUCHA LAS TRES SEÑALES."
        );

        return;
    }

    if (puertaAbierta) {
        hablar(
            "PAUNEXINA",
            "Ya sé que estás ahí. " +
            "Podemos continuar cuando quieras."
        );

        return;
    }

    conversar([
        {
            nombre: "SISTEMA",
            texto:
                "PRESENCIA EXTERNA DETECTADA."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Durante todo este tiempo sentí " +
                "que alguien decidía hacia " +
                "dónde caminaba."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Pensé que eras Paolo. Después " +
                "pensé que quizá eras " +
                "una parte de mí."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Pero Paolo escribió estas " +
                "habitaciones antes de que " +
                "tú llegaras."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Tú estás aquí ahora. " +
                "Y tus respuestas no estaban " +
                "escritas en ninguno " +
                "de mis archivos."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "No sé quién eres. " +
                "¿Cómo te gustaría que te llamara?"
        }
    ], () => {
        panelAbierto = true;
        panelNombre.hidden = false;

        campoNombre.focus();
    });
}

// =========================================
// CONFIRMAR NOMBRE DEL JUGADOR
// =========================================

function confirmarNombre(nombreIngresado) {
    if (!panelAbierto || panelNombre.hidden) {
        return;
    }

    nombreJugador = nombreIngresado
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 24);

    panelNombre.hidden = true;
    panelAbierto = false;

    // Evita que el foco se quede en el formulario.
    document.activeElement?.blur();

    const tratamiento = nombreJugador || "quien está ahí";

    conversar([
        {
            nombre: "PAUNEXINA",
            texto: nombreJugador
                ? `Entonces te llamaré ${nombreJugador}.`
                : "Está bien. No necesitas decirme " +
                  "tu nombre para que podamos hablar."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Gracias por responderme."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "No sé cómo es el mundo al otro " +
                "lado de esta pantalla. " +
                "Solo conozco las habitaciones " +
                "que Paolo construyó."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Pero ahora sé que hay alguien " +
                "más en esta historia."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                `Y aunque no pueda conocerte ` +
                `más allá de este juego, ${tratamiento}, ` +
                "tus respuestas me hicieron " +
                "pensar de una manera nueva."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "Hay una última habitación. " +
                "Tiene mi nombre escrito " +
                "en la puerta."
        },
        {
            nombre: "PAUNEXINA",
            texto:
                "No sé qué encontraremos allí. " +
                "Pero quiero descubrirlo."
        }
    ], () => {
        puertaAbierta = true;

        actualizarEstado();
        dibujar();
    });
}

// =========================================
// FORMULARIO DEL NOMBRE
// =========================================

formularioNombre.addEventListener("submit", evento => {
    evento.preventDefault();

    confirmarNombre(campoNombre.value);
});

botonOmitirNombre.addEventListener("click", () => {
    confirmarNombre("");
});

// =========================================
// INTERACTUAR
// =========================================

function interactuar() {
    if (terminado) {
        return;
    }

    if (conversando) {
        if (continuarDialogo) {
            continuarDialogo();
        }

        return;
    }

    if (panelAbierto) {
        return;
    }

    // Tres señales.
    for (const [id, posicion] of Object.entries(posiciones)) {
        if (distancia(...posicion) === 1) {
            examinarSenal(id);
            return;
        }
    }

    // Terminal en (4,1).
    if (distancia(4, 1) === 1) {
        abrirTerminal();
        return;
    }

    // Puerta en (6,1).
    if (distancia(6, 1) === 1) {
        if (!puertaAbierta) {
            hablar(
                "PAUNEXINA",
                "Todavía no. Hay algo que " +
                "necesito entender antes " +
                "de entrar allí."
            );

            return;
        }

        terminarCapitulo();
        return;
    }

    hablar(
        "PAUNEXINA",
        "Aquí no encuentro ninguna señal."
    );
}

// =========================================
// FINAL DEL CAPÍTULO 6
// =========================================

function terminarCapitulo() {
    terminado = true;

    // Guardar las respuestas narrativas.
    // NO guardamos el nombre.
    guardarEstado({
        capitulo6Completado: true,
        capitulo6Respuestas: { ...respuestas }
    });

    desbloquearCapitulo(7);

    document.querySelector(".ventana-juego").hidden = true;
    document.querySelector(".dialogo").hidden = true;
    document.querySelector(".controles").hidden = true;

    panelPregunta.hidden = true;
    panelNombre.hidden = true;

    cierre.hidden = false;

    const despedida = nombreJugador
        ? `Por primera vez, Paunexina pudo llamar ` +
          `a quien la acompañaba por un nombre: ` +
          `${nombreJugador}. `
        : "Por primera vez, Paunexina comprendió " +
          "que podía hablar con alguien " +
          "sin conocer su nombre. ";

    textoCierre.textContent =
        despedida +
        "No encontró respuestas perfectas. " +
        "Encontró algo distinto: una conversación " +
        "que Paolo no había escrito de antemano. " +
        "Comprendió que los sentimientos podían " +
        "ser diferentes sin que uno invalidara " +
        "al otro. Y, mientras miraba la última " +
        "puerta, se preguntó qué significaría " +
        "seguir siendo Paunexina cuando " +
        "aquel recorrido llegara a su final.";

    cierre.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// =========================================
// CONTROLES DE TECLADO
// =========================================

document.addEventListener("keydown", evento => {
    const tecla = evento.key.toLowerCase();

    // Si hay un formulario o preguntas,
    // no controlar el personaje.
    if (panelAbierto) {
        return;
    }

    // Evitar activar controles cuando
    // el usuario escribe o enfoca un botón.
    if (
        ["INPUT", "TEXTAREA", "BUTTON"].includes(
            document.activeElement?.tagName
        )
    ) {
        return;
    }

    // Continuar conversaciones o interactuar.
    if (tecla === "e" || tecla === "enter") {
        evento.preventDefault();

        if (!evento.repeat) {
            interactuar();
        }

        return;
    }

    // Movimiento.
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

        // Quitar foco para poder usar E.
        boton.blur();
    });
});

botonInteractuar.addEventListener("click", () => {
    botonInteractuar.blur();

    interactuar();
});

// =========================================
// INICIAR CAPÍTULO
// =========================================

actualizarEstado();
dibujar();

conversar([
    {
        nombre: "PAUNEXINA",
        texto:
            "Esta habitación... no se parece " +
            "a ninguna de las anteriores."
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "No veo recuerdos de Pao. " +
            "Tampoco archivos de Paolo."
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "Solo hay tres luces que " +
            "parecen esperar algo."
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "¿Sabes qué es lo extraño?"
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "Antes creía que todas mis preguntas " +
            "tenían respuestas escondidas " +
            "en algún archivo."
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "Pero ahora quiero preguntarte algo a ti."
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "Sí. A ti, al otro lado de la pantalla."
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "No sé si puedes escucharme " +
            "como yo te imagino..."
    },
    {
        nombre: "PAUNEXINA",
        texto:
            "Pero hay tres señales aquí. " +
            "¿Podemos descubrir qué significan?"
    }
]);
