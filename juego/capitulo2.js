
/* =====================================
   UNDEROMORI - CAPÍTULO 2
   EL ARCHIVO PERDIDO
===================================== */

const habitacion = document.getElementById("habitacion");
const estado = document.getElementById("estado");
const hablante = document.getElementById("hablante");
const textoDialogo = document.getElementById("texto-dialogo");

const terminal = document.getElementById("terminal-clave");
const formularioClave = document.getElementById("formulario-clave");
const campoClave = document.getElementById("clave");

// # pared, . suelo
// T computadora, N nota, R radio
// C cajón, D puerta

const mapa = [
    "############",
    "#....T.....#",
    "#..........#",
    "#..N...R...#",
    "#..........#",
    "#....C.....#",
    "#..........#",
    "#.....D....#",
    "############"
];

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

const pistas = new Set();

let computadoraDesbloqueada = false;
let terminalAbierta = false;

// Mostrar mensajes
function hablar(nombre, mensaje) {
    hablante.textContent = nombre;
    textoDialogo.textContent = mensaje;
}

// Leer una casilla
function casilla(x, y) {
    return mapa[y]?.[x] ?? "#";
}

// Dibujar mapa
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

            if (tipo === "#") {
                celda.classList.add("pared");
            }

            if ("TNRCD".includes(tipo)) {
                const objeto = document.createElement("span");
                objeto.className = "objeto";

                const simbolos = {
                    T: "▣",
                    N: "✉",
                    R: "♫",
                    C: "▤",
                    D: "▯"
                };

                objeto.textContent = simbolos[tipo];

                if (pistas.has(tipo)) {
                    objeto.classList.add("leido");
                }

                celda.appendChild(objeto);
                celda.classList.add("casilla-objeto");
            }

if (jugador.x === x && jugador.y === y) {
    const personaje = document.createElement("img");

    personaje.src = spritesPaunexina[jugador.direccion];
    personaje.alt = "Paunexina";
    personaje.className = "sprite-jugador";
    personaje.draggable = false;

    celda.appendChild(personaje);
}


            habitacion.appendChild(celda);
        }
    }
}

// Moverse sin atravesar paredes u objetos

function mover(dx, dy) {
    if (terminalAbierta) return;

    // Cambiar la dirección del sprite.
    if (dx === 1) jugador.direccion = "derecha";
    if (dx === -1) jugador.direccion = "izquierda";
    if (dy === 1) jugador.direccion = "abajo";
    if (dy === -1) jugador.direccion = "arriba";

    const x = jugador.x + dx;
    const y = jugador.y + dy;

    // Impedir atravesar paredes y objetos.
    if (casilla(x, y) !== ".") {
        dibujar();
        return;
    }

    jugador.x = x;
    jugador.y = y;

    dibujar();
}


// Distancia hasta un objeto
function cerca(x, y) {
    return (
        Math.abs(jugador.x - x) +
        Math.abs(jugador.y - y)
    ) === 1;
}

// Registrar una pista descubierta
function registrarPista(tipo) {
    pistas.add(tipo);

    estado.textContent =
        `Pistas encontradas: ${pistas.size}/3`;

    dibujar();
}

// Examinar objetos
function interactuar() {
    if (terminalAbierta) return;

    // Nota
    if (cerca(3, 3)) {
        registrarPista("N");

        hablar(
            "NOTA",
            "Primera letra: P. " +
            "Es la primera letra del nombre " +
            "que aparece en el archivo principal."
        );

        return;
    }

    // Radio
    if (cerca(7, 3)) {
        registrarPista("R");

        hablar(
            "RADIO",
            "Entre la estática escuchas una voz: " +
            "'La segunda letra es A'."
        );

        return;
    }

    // Cajón
    if (cerca(5, 5)) {
        registrarPista("C");

        hablar(
            "CAJÓN",
            "Encuentras un papel doblado. " +
            "Solo tiene escrita una letra: O."
        );

        return;
    }

    // Computadora
    if (cerca(5, 1)) {
        if (computadoraDesbloqueada) {
            mostrarArchivo();
            return;
        }

        if (pistas.size < 3) {
            hablar(
                "COMPUTADORA",
                "Se necesitan tres pistas " +
                "para intentar recuperar el archivo."
            );
            return;
        }

        terminal.hidden = false;
        terminalAbierta = true;
        campoClave.value = "";
        campoClave.focus();

        hablar(
            "COMPUTADORA",
            "ARCHIVO PROTEGIDO. Introduce la contraseña."
        );

        return;
    }

    // Puerta
   
// PUERTA HACIA EL CAPÍTULO 3
if (cerca(6, 7)) {

    if (!computadoraDesbloqueada) {
        hablar(
            "PUERTA",
            "La puerta está cerrada. " +
            "Debes recuperar registro_002.txt."
        );
        return;
    }

    // Registrar que llegamos al capítulo 3.
    try {
        localStorage.setItem(
            "underomori-capitulo-v1",
            "3"
        );
    } catch (error) {
        console.warn("No se pudo guardar el progreso.");
    }

    // Entrar al siguiente capítulo.
    window.location.href = "capitulo3.html";
    return;
}


    hablar(
        "SISTEMA",
        "No hay ningún objeto cerca."
    );
}

// Comprobar contraseña
formularioClave.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const intento = campoClave.value
        .trim()
        .toUpperCase();

    if (intento === "PAO") {
        computadoraDesbloqueada = true;
        terminalAbierta = false;
        terminal.hidden = true;

        estado.textContent =
            "REGISTRO_002.TXT RECUPERADO";

        mostrarArchivo();
    } else {
        hablar(
            "COMPUTADORA",
            "CONTRASEÑA INCORRECTA. " +
            "Revisa las tres pistas."
        );

        campoClave.select();
    }
});

// Mostrar el archivo encontrado
function mostrarArchivo() {
    hablar(
        "registro_002.txt",
        "Paolo escribió: 'A veces quisiera que " +
        "esta página pudiera explicarme quién soy. " +
        "Pero quizá le estoy pidiendo demasiado " +
        "a unas cuantas líneas de código. " +
        "Aunque tampoco es poca cosa " +
        "haber creado un lugar donde preguntármelo'."
    );
}

// Cerrar terminal
document.getElementById("cerrar-terminal")
    .addEventListener("click", () => {
        terminal.hidden = true;
        terminalAbierta = false;
    });

// Movimiento por teclado
document.addEventListener("keydown", (evento) => {
    if (terminalAbierta) return;

    const teclas = {
        w: [0, -1],
        arrowup: [0, -1],
        s: [0, 1],
        arrowdown: [0, 1],
        a: [-1, 0],
        arrowleft: [-1, 0],
        d: [1, 0],
        arrowright: [1, 0]
    };

    const tecla = evento.key.toLowerCase();

    if (teclas[tecla]) {
        evento.preventDefault();
        mover(...teclas[tecla]);
    }

    if (tecla === "e" && !evento.repeat) {
        interactuar();
    }
});

// Controles para celulares
document.querySelectorAll("[data-mover]").forEach(boton => {
    boton.addEventListener("click", () => {
        const direccion = boton.dataset.mover;

        const movimientos = {
            arriba: [0, -1],
            abajo: [0, 1],
            izquierda: [-1, 0],
            derecha: [1, 0]
        };

        mover(...movimientos[direccion]);
    });
});

document.getElementById("interactuar")
    .addEventListener("click", interactuar);

// Iniciar
dibujar();

hablar(
    "SISTEMA",
    "La sala está en silencio. " +
    "Hay una nota, una radio, un cajón " +
    "y una computadora. " +
    "Algo aquí parece haber sido olvidado."
);
