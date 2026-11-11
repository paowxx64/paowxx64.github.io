
/* =========================================
   UNDEROMORI - CAPÍTULO 3
   ANTES DE TENER UN NOMBRE
========================================= */

const habitacion = document.getElementById("habitacion");
const estado = document.getElementById("estado");
const hablante = document.getElementById("hablante");
const textoDialogo = document.getElementById("texto-dialogo");
const elecciones = document.getElementById("elecciones");
const pregunta = document.getElementById("pregunta");
const opciones = document.getElementById("opciones");
const cierre = document.getElementById("cierre");

// Guardaremos las elecciones para futuros capítulos.
const CLAVE_RECUERDOS = "underomori-recuerdos-v1";
const CLAVE_CAPITULO = "underomori-capitulo-v1";

// # Pared | . Suelo | P Pao
// 1,2,3 Recuerdos | D Puerta

const mapa = [
    "#########",
    "#...P...#",
    "#.......#",
    "#1.....2#",
    "#.......#",
    "#...3.D.#",
    "#########"
];

const jugador = {
    x: 4,
    y: 4,
    direccion: "abajo"
};

const spritesPaunexina = {
    abajo: "../assets/sprites/paunexina-abajo.png",
    arriba: "../assets/sprites/paunexina-arriba.png",
    izquierda: "../assets/sprites/paunexina-izquierda.png",
    derecha: "../assets/sprites/paunexina-derecha.png"
};

const spritePao = "../assets/sprites/pao.png";

const recuerdos = {
    "1": {
        nombre: "Un dibujo",
        pregunta:
            "Pao dibujó una casa entre las estrellas. " +
            "¿Qué crees que estaba imaginando?",
        opciones: [
            "Un lugar al que pertenecer",
            "Un lugar por descubrir"
        ],
        respuesta:
            "En la esquina del dibujo hay una frase: " +
            "'Cuando sea grande, quiero conocer " +
            "lugares que todavía no existen'."
    },

    "2": {
        nombre: "Una melodía",
        pregunta:
            "Encuentras una melodía grabada por Pao. " +
            "Está incompleta. ¿Qué harías con ella?",
        opciones: [
            "Guardar la grabación como está",
            "Imaginar cómo podría continuar"
        ],
        respuesta:
            "La melodía se interrumpe a la mitad. " +
            "Al final se escucha una voz pequeña: " +
            "'Mañana la termino'."
    },

    "3": {
        nombre: "Una carta",
        pregunta:
            "Pao escribió una carta para su yo del futuro. " +
            "¿Qué parte abrirías primero?",
        opciones: [
            "La pregunta que dejó escrita",
            "El espacio que dejó para una respuesta"
        ],
        respuesta:
            "La carta dice: " +
            "'No sé cómo seremos cuando crezcamos. " +
            "Pero espero que todavía nos guste " +
            "imaginar cosas'."
    }
};

let respuestas = {};
let dialogosPendientes = [];
let hablandoConPao = false;
let puertaAbierta = false;
let terminado = false;
let conversacionInicialTerminada = false;


function hablar(nombre, texto) {
    hablante.textContent = nombre;
    textoDialogo.textContent = texto;
}




let continuarDialogo = null;

function conversar(nombre, lineas, alTerminar = null) {
    dialogosPendientes = [...lineas];
    hablandoConPao = true;

    function siguiente() {

        // Mostrar siguiente frase
        if (dialogosPendientes.length > 0) {
            hablar(nombre, dialogosPendientes.shift());
            return;
        }

        // Terminar conversación
        hablandoConPao = false;
        continuarDialogo = null;

        if (alTerminar) {
            alTerminar();
        } else {
            hablar(
                "SISTEMA",
                "La conversación terminó. Puedes seguir explorando."
            );
        }
    }

    continuarDialogo = siguiente;

    // Mostrar primera frase
    siguiente();
}

 

function casilla(x, y) {
    return mapa[y]?.[x] ?? "#";
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

        
if (tipo === "P") {
    const pao = document.createElement("img");

    pao.src = spritePao;
    pao.alt = "Pao";
    pao.className = "sprite-pao";
    pao.draggable = false;

    celda.appendChild(pao);
}


            if ("123".includes(tipo)) {
                const objeto = document.createElement("span");
                objeto.className = "recuerdo";

                objeto.textContent =
                    respuestas[tipo] !== undefined
                        ? "✦"
                        : "◇";

                if (respuestas[tipo] !== undefined) {
                    objeto.classList.add("recuperado");
                }

                celda.appendChild(objeto);
            }

            if (tipo === "D") {
                const puerta = document.createElement("span");
                puerta.className = "puerta-recuerdo";
                puerta.textContent =
                    puertaAbierta ? "▯" : "▣";

                celda.appendChild(puerta);
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

function distancia(x, y) {
    return Math.abs(jugador.x - x) +
           Math.abs(jugador.y - y);
}

function contarRecuerdos() {
    return ["1", "2", "3"].filter(
        id => respuestas[id] !== undefined
    ).length;
}

function actualizarEstado() {
    estado.textContent =
        `Recuerdos recuperados: ${contarRecuerdos()}/3`;
}

function mover(dx, dy) {
    if (
        terminado ||
        hablandoConPao ||
        !elecciones.hidden
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

// Conversaciones de Pao que cambian
// según los recuerdos encontrados.

function hablarConPao() {
    const cantidad = contarRecuerdos();

    // Primera conversación
    if (cantidad === 0) {

        if (conversacionInicialTerminada) {
            hablar(
                "PAO",
                "¿Encontraste algo? Puedes explorar mis recuerdos. " +
                "Yo seguiré aquí."
            );
            return;
        }

        conversar("PAO", [
            "¿Hola...? No sabía que había alguien más aquí.",
            "Te pareces a alguien que todavía no conozco.",
            "¿Vienes del futuro?",
            "Me llamo Pao. Algún día quiero crear algo " +
            "que haga que otras personas se sientan acompañadas."
        ], () => {
            conversacionInicialTerminada = true;

            hablar(
                "PAUNEXINA",
                "Pao... Ese nombre me resulta familiar. " +
                "Quizá debería examinar los recuerdos."
            );
        });

        return;
    }

    // Si recuperamos uno o dos recuerdos
    if (cantidad < 3) {
        hablar(
            "PAO",
            "Encontraste algunas de mis cosas, ¿verdad? " +
            "No tienes que entenderlas todas. " +
            "Me pregunto si cuando crezca seguiré imaginando cosas."
        );
        return;
    }

    // Cuando ya tenemos los tres recuerdos
    if (puertaAbierta) {
        hablar(
            "PAO",
            "Gracias por escucharme. " +
            "Puedes continuar tu camino."
        );
        return;
    }

    // Conversación final del capítulo
    conversar("PAO", [
        "Encontraste todo lo que había dejado aquí.",
        "Entonces... ¿tú conoces a Paolo?",
        "No tienes que decirme cómo será su vida.",
        "Solo quería saber si todavía " +
        "le gustan algunas de las mismas cosas.",
        "Si alguna vez lo encuentras, " +
        "dile que no tiene que convertirse " +
        "en todo lo que imaginé.",
        "Espero que todavía tenga motivos para sonreír."
    ], () => {
        puertaAbierta = true;

        hablar(
            "PAUNEXINA",
            "Pao no sabe quién soy. " +
            "Pero creo que empiezo a entender " +
            "por qué Paolo me creó. " +
            "La puerta del este está abierta."
        );

        dibujar();
    });
}

// Abrir un recuerdo.
function examinarRecuerdo(id) {
    if (respuestas[id] !== undefined) {
        hablar(
            recuerdos[id].nombre,
            recuerdos[id].respuesta
        );
        return;
    }

    const recuerdo = recuerdos[id];

    pregunta.textContent = recuerdo.pregunta;
    opciones.innerHTML = "";

    recuerdo.opciones.forEach((texto, indice) => {
        const boton = document.createElement("button");

        boton.type = "button";
        boton.textContent = texto;

        boton.addEventListener("click", () => {
    // Guardar únicamente durante la partida actual
    respuestas[id] = indice;

    elecciones.hidden = true;

            conversar("PAUNEXINA", [
                recuerdo.respuesta,
                "Es curioso... yo no viví esto. " +
                "Pero alguien quiso que lo encontrara."
            ]);

            actualizarEstado();
            dibujar();

            if (contarRecuerdos() === 3) {
                estado.textContent =
                    "3/3 recuerdos · Regresa con Pao";
            }
        });

        opciones.appendChild(boton);
    });

    elecciones.hidden = false;

    hablar(
        "PAUNEXINA",
        "Este recuerdo está incompleto. " +
        "Quizá podamos reconstruirlo."
    );

    elecciones.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function interactuar() {
    if (terminado) return;

    if (hablandoConPao) {
        continuarDialogo();
        return;
    }

    if (!elecciones.hidden) return;

    // Pao está en (4,1).
    if (distancia(4, 1) === 1) {
        hablarConPao();
        return;
    }

    const posiciones = {
        "1": [1, 3],
        "2": [7, 3],
        "3": [4, 5]
    };

    for (const [id, posicion] of Object.entries(posiciones)) {
        if (distancia(...posicion) === 1) {
            examinarRecuerdo(id);
            return;
        }
    }

    // Puerta en (6,5).
    if (distancia(6, 5) === 1) {
        if (!puertaAbierta) {
            hablar(
                "PAUNEXINA",
                "La puerta permanece cerrada. " +
                "Siento que debo hablar con Pao " +
                "antes de irme."
            );
            return;
        }

        terminarCapitulo();
        return;
    }

    hablar(
        "PAUNEXINA",
        "No hay nada que pueda examinar aquí."
    );
}

function terminarCapitulo() {
    terminado = true;

    try {
        const progreso = Number(
            localStorage.getItem(CLAVE_CAPITULO) || 1
        );

        localStorage.setItem(
            CLAVE_CAPITULO,
            String(Math.max(progreso, 4))
        );
    } catch (error) {
        console.warn("No se pudo guardar el progreso.");
    }

    document.querySelector(".ventana-juego").hidden = true;
    document.querySelector(".dialogo").hidden = true;
    document.querySelector(".controles").hidden = true;
    elecciones.hidden = true;

    cierre.hidden = false;

    document.getElementById("texto-cierre").textContent =
        "Pao se quedó junto a la ventana. " +
        "Paunexina siguió caminando. " +
        "Por primera vez comprendió que crecer " +
        "no significa traicionar al niño que alguna vez fuiste. " +
        "Y que quizá ella también formaba parte " +
        "de los futuros que Paolo había imaginado.";

    cierre.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

// Botón para continuar al Capítulo 4
const enlaceCapitulo4 = document.createElement("a");

enlaceCapitulo4.href = "capitulo4.html";
enlaceCapitulo4.textContent =
    "▶ CONTINUAR AL CAPÍTULO 4";

enlaceCapitulo4.className = "enlace-siguiente";

cierre.appendChild(enlaceCapitulo4);

}

// Teclado


document.addEventListener("keydown", evento => {
    const tecla = evento.key.toLowerCase();

    // Si hay opciones abiertas, dejamos que
    // el jugador seleccione con los botones.
    if (!elecciones.hidden) {
        return;
    }

    // Avanzar diálogo con E o Enter.
    if (tecla === "e" || tecla === "enter") {
        evento.preventDefault();

        if (evento.repeat) return;

        interactuar();
        return;
    }

    // Evitar movimiento durante diálogos.
    if (hablandoConPao || terminado) {
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



// Controles para celulares
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
    .addEventListener("click", interactuar);

// Iniciar
actualizarEstado();
dibujar();

hablar(
    "PAUNEXINA",
    "Esta habitación... no parece un archivo. " +
    "Parece un recuerdo. " +
    "Y hay alguien junto a la ventana."
);


// REINICIAR CAPÍTULO 3 DURANTE EL DESARROLLO
// Ejecutar desde la consola: reiniciarCapitulo3()

window.reiniciarCapitulo3 = function () {
    localStorage.removeItem("underomori-recuerdos-v1");
    location.reload();
};