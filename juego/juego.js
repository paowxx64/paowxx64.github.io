
/* =====================================
   UNDEROMORI - HABITACIÓN 001
===================================== */

// Elementos HTML
const habitacion = document.getElementById("habitacion");
const estado = document.getElementById("estado");
const hablante = document.getElementById("hablante");
const textoDialogo = document.getElementById("texto-dialogo");
const decision = document.getElementById("decision");
const resultado = document.getElementById("resultado");

// Guardado de la partida
const CLAVE_FINAL = "underomori-final-v1";
const CLAVE_AVATAR = "underomori-avatar-oculto";

// Leyenda:
// # = pared
// . = suelo
// T = escritorio
// B = cama
// S = estantería
// P = planta
// C = computadora
// D = puerta
// 1, 2, 3 = archivos

const mapa = [
    "############",
    "#....C.....#",
    "#..TT......#",
    "#1.....S..2#",
    "#..........#",
    "#..BBB..P..#",
    "#..........#",
    "#3.........#",
    "#####D######"
];

const ANCHO = 12;
const ALTO = 9;

// Posición inicial del jugador
const jugador = {
    x: 6,
    y: 6,
    direccion: "abajo"
};

const spritesPaunexina = {
    abajo: "../assets/sprites/paunexina-abajo.png",
    arriba: "../assets/sprites/paunexina-arriba.png",
    izquierda: "../assets/sprites/paunexina-izquierda.png",
    derecha: "../assets/sprites/paunexina-derecha.png"
};


// Los tres archivos de la historia
const archivos = [
    {
        id: "pao",
        x: 1,
        y: 3,
        simbolo: "✉",
        nombre: "pao.txt",
        leido: false,
        texto:
            "Pao es el nombre que quedó en los recuerdos. " +
            "No contiene una vida entera, solamente fragmentos. " +
            "Y aun así, cada fragmento perteneció a un momento real."
    },
    {
        id: "paolo",
        x: 10,
        y: 3,
        simbolo: "▣",
        nombre: "paolo.txt",
        leido: false,
        texto:
            "Paolo existe fuera de esta ventana. " +
            "La página puede guardar sus palabras, " +
            "pero no todos sus días. Quizá ninguna imagen " +
            "pueda contener completamente a una persona."
    },
    {
        id: "paunexina",
        x: 1,
        y: 7,
        simbolo: "◇",
        nombre: "paunexina.exe",
        leido: false,
        texto:
            "Me llamaron Paunexina. Soy una imagen y unas frases " +
            "que alguien escribió. No soy Paolo. " +
            "Pero cuando lees esto, algo que quiso expresar " +
            "llega hasta ti."
    }
];

let terminado = false;
let decisionAbierta = false;
let pasos = 0;
let computadoraActivada = false;

// Mostrar texto
function hablar(nombre, mensaje) {
    hablante.textContent = nombre;
    textoDialogo.textContent = mensaje;
}

// Distancia entre el jugador y un objeto
function distancia(a, b) {
    return Math.abs(a.x - b.x) +
           Math.abs(a.y - b.y);
}

// Obtener el símbolo de una posición
function obtenerCasilla(x, y) {
    return mapa[y]?.[x] ?? "#";
}

// Dibujar toda la habitación
function dibujarHabitacion(animar = false) {
    habitacion.innerHTML = "";

    for (let y = 0; y < ALTO; y++) {
        for (let x = 0; x < ANCHO; x++) {

            const tipo = obtenerCasilla(x, y);

            const celda = document.createElement("div");
            celda.classList.add("celda", "casilla-juego");

            // Paredes y suelo
            if (tipo === "#") {
                celda.classList.add("pared");
            } else {
                celda.classList.add("suelo");
            }

            const muebles = {
                T: ["escritorio", "▤"],
                B: ["cama", ""],
                S: ["estanteria", "▥"],
                P: ["planta", "♣"],
                C: ["computadora", "▣"],
                D: ["puerta", "▯"]
            };

            if (muebles[tipo]) {
                const [clase, simbolo] = muebles[tipo];

                celda.classList.add("mueble", clase);

                if (simbolo) {
                    const icono = document.createElement("span");
                    icono.className = "icono-mueble";
                    icono.textContent = simbolo;
                    celda.appendChild(icono);
                }
            }

            // Colocar archivos
            const archivo = archivos.find(
                a => a.x === x && a.y === y
            );

            if (archivo) {
                const icono = document.createElement("span");
                icono.classList.add("objeto");

                icono.textContent = archivo.simbolo;

                if (archivo.leido) {
                    icono.classList.add("leido");
                }

                celda.appendChild(icono);
            }

            // Dibujar personaje

if (jugador.x === x && jugador.y === y) {
    const personaje = document.createElement("img");

    personaje.src = spritesPaunexina[jugador.direccion];
    personaje.alt = "Paunexina";
    personaje.className = "sprite-jugador";
    personaje.draggable = false;

    if (animar) {
        personaje.classList.add("caminando");
    }

    celda.appendChild(personaje);
}


            habitacion.appendChild(celda);
        }
    }
}

// Dirección hacia la que mira el personaje
function cambiarDireccion(dx, dy) {
    if (dx === 1) jugador.direccion = "derecha";
    if (dx === -1) jugador.direccion = "izquierda";
    if (dy === 1) jugador.direccion = "abajo";
    if (dy === -1) jugador.direccion = "arriba";
}

// Comprobar colisiones
function esObstaculo(x, y) {
    const tipo = obtenerCasilla(x, y);

    // Se puede caminar solamente por el suelo
    return tipo !== ".";
}

// Mover al personaje
function mover(dx, dy) {
    if (terminado || decisionAbierta) return;

    cambiarDireccion(dx, dy);

    const nuevoX = jugador.x + dx;
    const nuevoY = jugador.y + dy;

    if (
        nuevoX < 0 || nuevoX >= ANCHO ||
        nuevoY < 0 || nuevoY >= ALTO
    ) {
        return;
    }

    if (esObstaculo(nuevoX, nuevoY)) {
        dibujarHabitacion();

        if (obtenerCasilla(nuevoX, nuevoY) === "D") {
            hablar(
                "SISTEMA",
                "La puerta está cerrada. " +
                "Parece que todavía tienes algo que descubrir aquí."
            );
        }

        return;
    }

    jugador.x = nuevoX;
    jugador.y = nuevoY;
    pasos++;

    dibujarHabitacion(true);

    // Pequeño detalle narrativo
    if (pasos === 12) {
        hablar(
            "???",
            "Puedo escuchar tus pasos. " +
            "Es extraño escuchar a alguien después de tanto tiempo."
        );
    }
}

// Abrir la decisión final
function abrirDecision() {
    decisionAbierta = true;

    hablar(
        "PAUNEXINA",
        "Has encontrado los tres nombres. " +
        "Ahora hay algo que quisiera preguntarte."
    );

    decision.hidden = false;
    decision.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// Examinar objetos cercanos
function interactuar() {
    if (terminado || decisionAbierta) return;

    const archivo = archivos.find(
        a => distancia(jugador, a) === 1
    );

    if (archivo) {
        archivo.leido = true;

        hablar(archivo.nombre, archivo.texto);

        const encontrados =
            archivos.filter(a => a.leido).length;

        estado.textContent =
            `Archivos encontrados: ${encontrados}/3`;

        dibujarHabitacion();

        if (encontrados === 3) {
            estado.textContent =
                "3/3 archivos · Computadora desbloqueada";
        }

        return;
    }

    
// ===================================
// COMPUTADORA PRINCIPAL
// ===================================

const computadora = { x: 5, y: 1 };

if (distancia(jugador, computadora) === 1) {

    const archivosCompletos =
        archivos.every(a => a.leido);

    // Todavía faltan archivos
    if (!archivosCompletos) {
        hablar(
            "COMPUTADORA",
            "ACCESO DENEGADO. " +
            "Faltan archivos por recuperar."
        );
        return;
    }

    // Primera vez que utiliza la computadora
    if (!computadoraActivada) {

        computadoraActivada = true;

        hablar(
            "PAUNEXINA",
            "Oh... encontraste la computadora. " +
            "Sabía que alguien terminaría llegando aquí. " +
            "Pero hay algo extraño: " +
            "existen tres nombres y solamente una persona. " +
            "En el siguiente archivo quizá encontremos una respuesta."
        );

        estado.textContent =
            "NUEVO OBJETIVO: Examina la puerta del sur.";

        return;
    }

    // Si vuelve a interactuar
    hablar(
        "COMPUTADORA",
        "ARCHIVO RECUPERADO: registro_002.txt. " +
        "Tres nombres. Una identidad. " +
        "La puerta del sur está desbloqueada."
    );

    return;
}


// ===================================
// PUERTA AL SIGUIENTE CAPÍTULO
// ===================================

const puerta = { x: 5, y: 8 };

if (distancia(jugador, puerta) === 1) {

    if (!computadoraActivada) {
        hablar(
            "SISTEMA",
            "La puerta está cerrada. " +
            "Quizá debas investigar la computadora."
        );
        return;
    }

    hablar(
        "PAUNEXINA",
        "La puerta está abierta... " +
        "Al otro lado hay un lugar que no recuerdo. " +
        "Tal vez allí podamos descubrir " +
        "por qué Paolo creó esta página."
    );

      // Entrar al capítulo siguiente
    window.location.href = "capitulo2.html";
    return;
}

    // Otros muebles
    const objetos = [
        {
            x: 3, y: 2,
            nombre: "ESCRITORIO",
            texto: "Está cubierto de polvo. " +
                   "Alguien trabajaba aquí."
        },
        {
            x: 4, y: 2,
            nombre: "ESCRITORIO",
            texto: "Hay marcas de una taza antigua " +
                   "junto al teclado."
        },
        {
            x: 4, y: 5,
            nombre: "CAMA",
            texto: "Las sábanas están desordenadas. " +
                   "Parece que alguien se levantó hace poco."
        },
        {
            x: 7, y: 3,
            nombre: "ESTANTERÍA",
            texto: "Hay libros sin título. " +
                   "Uno tiene una página marcada."
        },
        {
            x: 8, y: 5,
            nombre: "PLANTA",
            texto: "Una pequeña planta crece " +
                   "junto a la pared. " +
                   "Alguien debió cuidarla."
        },
        {
            x: 5, y: 8,
            nombre: "PUERTA",
            texto: "La puerta no se abre todavía. " +
                   "Quizá la computadora tenga una respuesta."
        }
    ];

    const objeto = objetos.find(
        o => distancia(jugador, o) === 1
    );

    if (objeto) {
        hablar(objeto.nombre, objeto.texto);
        return;
    }

    hablar(
        "SISTEMA",
        "No hay nada cerca que puedas examinar."
    );
}

// Guardar el desenlace
function elegirFinal(eleccion) {
    if (terminado || !decisionAbierta) return;

    terminado = true;
    decisionAbierta = false;

    try {
        localStorage.setItem(
            CLAVE_FINAL,
            eleccion
        );

        if (eleccion === "dejar-ir") {
            localStorage.setItem(
                CLAVE_AVATAR,
                "true"
            );
        } else {
            localStorage.removeItem(CLAVE_AVATAR);
        }
    } catch (error) {
        console.warn("No se pudo guardar:", error);
    }

    mostrarResultado(eleccion);
}

// Mostrar final
function mostrarResultado(eleccion) {
    terminado = true;

    document.querySelector(".ventana-juego").hidden = true;
    document.querySelector(".dialogo").hidden = true;
    document.querySelector(".controles").hidden = true;

    decision.hidden = true;
    resultado.hidden = false;

    const titulo =
        document.getElementById("titulo-resultado");

    const texto =
        document.getElementById("texto-resultado");

    if (eleccion === "conservar") {
        titulo.textContent = "FINAL 01 — UNA IMAGEN";

        texto.textContent =
            "Decidiste conservar a Paunexina. " +
            "La página seguirá mostrando su rostro. " +
            "No será toda la historia de Paolo, " +
            "pero tampoco tiene que serlo.";
    } else {
        titulo.textContent =
            "FINAL 02 — UN ESPACIO VACÍO";

        texto.textContent =
            "Decidiste dejar ir su imagen. " +
            "La página será diferente, pero esta " +
            "conversación ocurrió. " +
            "No todo lo importante necesita " +
            "permanecer visible.";
    }

    resultado.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

// Controles de teclado
document.addEventListener("keydown", (evento) => {
    const tecla = evento.key.toLowerCase();

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

    if (tecla === "e" && !evento.repeat) {
        interactuar();
    }
});

// Controles táctiles
document.querySelectorAll("[data-mover]").forEach(boton => {
    boton.addEventListener("click", () => {
        const direccion = boton.dataset.mover;

        if (direccion === "arriba") mover(0, -1);
        if (direccion === "abajo") mover(0, 1);
        if (direccion === "izquierda") mover(-1, 0);
        if (direccion === "derecha") mover(1, 0);
    });
});

// Botones
document.getElementById("interactuar")
    .addEventListener("click", interactuar);

document.getElementById("conservar")
    .addEventListener("click", () =>
        elegirFinal("conservar")
    );

document.getElementById("dejar-ir")
    .addEventListener("click", () =>
        elegirFinal("dejar-ir")
    );

// Comprobar si existe una partida terminada
let finalAnterior = null;

try {
    finalAnterior = localStorage.getItem(CLAVE_FINAL);
} catch (error) {
    // El juego funciona sin almacenamiento
}

if (
    finalAnterior === "conservar" ||
    finalAnterior === "dejar-ir"
) {
    mostrarResultado(finalAnterior);
} else {
 dibujarHabitacion();

hablar(
    "SISTEMA",
    "Despertaste en una habitación desconocida. " +
    "Encuentra los tres archivos. " +
    "Quizá la computadora pueda explicarte " +
    "por qué estás aquí."
);
}
