
/* ==========================================
   ATRAPAESTRELLAS - PAOW ARCADE
   Versión completa con PAO.EXE
========================================== */

// ==========================================
// 1. ELEMENTOS DEL HTML
// ==========================================

const campo = document.getElementById("campo");
const cesta = document.getElementById("cesta");
const objetos = document.getElementById("objetos");

const puntosTexto = document.getElementById("puntos");
const tiempoTexto = document.getElementById("tiempo");
const recordTexto = document.getElementById("record");

const estrellasTexto =
    document.getElementById("estrellas-atrapadas");

const malosTexto =
    document.getElementById("malos-recuerdos");

const perdidosTexto =
    document.getElementById("puntos-perdidos");

const selectorDificultad =
    document.getElementById("dificultad");

const pantalla = document.getElementById("pantalla");

const tituloPantalla =
    document.getElementById("titulo-pantalla");

const mensajePantalla =
    document.getElementById("mensaje-pantalla");

const botonComenzar =
    document.getElementById("comenzar");

const botonIzquierda =
    document.getElementById("izquierda");

const botonDerecha =
    document.getElementById("derecha");

// ==========================================
// 2. ELEMENTOS DE PAO
// ==========================================

const spritePao = document.getElementById("sprite-pao");
const estadoPao = document.getElementById("estado-pao");
const mensajePao = document.getElementById("mensaje-pao");
const botonHablarPao = document.getElementById("hablar-pao");

const spritesPao = {
    neutral: "../assets/sprites/pao-neutral.png",
    asustado: "../assets/sprites/pao-asustado.png",
    asombrado: "../assets/sprites/pao-asombrado.png",
    feliz: "../assets/sprites/pao-feliz.png",
    triste: "../assets/sprites/pao-triste.png"
};

let expresionActual = "";

// Cambia la expresión y los diálogos de Pao.

function cambiarPao(expresion, titulo, mensaje) {
    if (!spritePao || !estadoPao || !mensajePao) {
        return;
    }

    if (expresionActual !== expresion) {
        spritePao.src =
            spritesPao[expresion] || spritesPao.neutral;

        expresionActual = expresion;
    }

    spritePao.alt = "Pao " + expresion;
    estadoPao.textContent = titulo;
    mensajePao.textContent = mensaje;
}

// ==========================================
// 3. DIÁLOGOS DE PAO
// ==========================================

const dialogosInicio = [
    "Owa... ¿quieres jugar conmigo? ♡",
    "¡Mira todas esas estrellas!",
    "¿Crees que podamos atraparlas todas?",
    "Las estrellas rosas valen muchos puntos.",
    "No atrapes los malos recuerdos rojos...",
    "¿Ya elegiste la dificultad?",
    "El modo difícil me asusta un poquito.",
    "¿Sabías que puedes hablar conmigo?",
    "¡Estoy listo cuando tú lo estés!",
    "Mmm... ¿de dónde vienen tantas estrellas?"
];

const dialogosPartida = [
    "¡Atrapa esa estrella!",
    "¡Cuidado con las rojas!",
    "¡Wow! ¡Qué rápido caen!",
    "¡Creo que hacemos un buen equipo!",
    "¡Las rosas dan 25 puntos!",
    "¡No te distraigas mirándome!",
    "¡Vamos, vamos, vamos!",
    "¡Hay estrellas por todas partes!",
    "¡No te rindas!",
    "¡Esto se está poniendo difícil!"
];

const dialogosFinal = [
    "¿Jugamos otra vez?",
    "Creo que podemos conseguir más puntos.",
    "¡Me gustó acompañarte!",
    "¿Quieres probar otra dificultad?",
    "Las estrellas siguen ahí... ♡",
    "¿Otra partida? ¡Yo te acompaño!"
];

let indiceDialogoPao = 0;
let ultimoComentarioPao = 0;

// Elegir los diálogos según el momento.

function obtenerDialogosActuales() {
    if (jugando) {
        return dialogosPartida;
    }

    if (partidaTerminada) {
        return dialogosFinal;
    }

    return dialogosInicio;
}

// Expresión que Pao tendrá al conversar.

function expresionConversacion() {
    if (jugando) {
        if (malosRecuerdos >= 6) {
            return "asustado";
        }

        if (puntos >= 300) {
            return "feliz";
        }

        if (puntos >= 120) {
            return "asombrado";
        }

        return "neutral";
    }

    if (partidaTerminada) {
        if (puntos >= 300) {
            return "feliz";
        }

        if (puntos >= 120) {
            return "asombrado";
        }

        if (puntos < 40) {
            return "triste";
        }
    }

    return "neutral";
}

// Hablar con Pao haciendo clic.

if (botonHablarPao) {
    botonHablarPao.addEventListener("click", () => {
        const dialogos = obtenerDialogosActuales();

        const mensaje =
            dialogos[indiceDialogoPao % dialogos.length];

        indiceDialogoPao++;

        cambiarPao(
            expresionConversacion(),
            "PAO.EXE ♡",
            mensaje
        );
    });
}

// Pao comenta espontáneamente durante el juego.

function comentarioAutomaticoPao(ahora) {
    if (!jugando) {
        return;
    }

    if (ahora - ultimoComentarioPao < 8000) {
        return;
    }

    ultimoComentarioPao = ahora;

    const indice = Math.floor(
        Math.random() * dialogosPartida.length
    );

    cambiarPao(
        expresionConversacion(),
        "PAO.EXE ♡",
        dialogosPartida[indice]
    );
}

// Reacciones a los puntos y malos recuerdos.

function actualizarEstadoPao() {
    if (!jugando) {
        return;
    }

    if (malosRecuerdos >= 6) {
        cambiarPao(
            "asustado",
            "¡Pao está asustado!",
            "¡Son demasiados malos recuerdos!"
        );
        return;
    }

    if (puntos >= 300) {
        cambiarPao(
            "feliz",
            "¡Pao está muy feliz!",
            "¡Mira cuántas estrellas atrapaste!"
        );
        return;
    }

    if (puntos >= 120) {
        cambiarPao(
            "asombrado",
            "¡Pao está sorprendido!",
            "¡Wow! ¡Lo estás haciendo increíble!"
        );
        return;
    }

    if (malosRecuerdos >= 2 && puntos <= 30) {
        cambiarPao(
            "triste",
            "Pao está preocupado...",
            "¡Cuidado! Esos recuerdos quitan puntos."
        );
        return;
    }

    cambiarPao(
        "neutral",
        "PAO.EXE ♡",
        "¡Vamos! ¡Todavía quedan estrellas!"
    );
}

// Reacción al finalizar.

function mostrarResultadoPao() {
    if (puntos >= 300) {
        cambiarPao(
            "feliz",
            "¡Pao está muy feliz!",
            "¡Conservaste muchísimas estrellas! ♡"
        );

    } else if (puntos >= 120) {
        cambiarPao(
            "asombrado",
            "¡Pao está impresionado!",
            "¡Lo hiciste bastante bien!"
        );

    } else if (puntos >= 40) {
        cambiarPao(
            "neutral",
            "Pao está tranquilo",
            "¡Fue una buena partida! Podemos mejorar."
        );

    } else {
        cambiarPao(
            "triste",
            "Pao está un poco triste...",
            "Hoy fue difícil, pero podemos intentarlo otra vez."
        );
    }
}

// ==========================================
// 4. MÚSICA Y SONIDOS
// ==========================================

const musicaArcade =
    document.getElementById("musica-arcade");

const sonidoEstrella =
    document.getElementById("sonido-estrella");

const sonidoMalo =
    document.getElementById("sonido-malo");

const sonidoFinal =
    document.getElementById("sonido-final");

if (musicaArcade) {
    musicaArcade.volume = 0.25;
    musicaArcade.loop = true;
}

if (sonidoEstrella) {
    sonidoEstrella.volume = 0.45;
}

if (sonidoMalo) {
    sonidoMalo.volume = 0.55;
}

if (sonidoFinal) {
    sonidoFinal.volume = 0.50;
}

// Reproducir un efecto.

function reproducirSonido(audio) {
    if (!audio) {
        return;
    }

    try {
        audio.currentTime = 0;

        audio.play().catch(() => {});

    } catch (error) {
        console.warn("No se pudo reproducir un sonido.");
    }
}

// Iniciar música.

function iniciarMusica() {
    if (!musicaArcade) {
        return;
    }

    musicaArcade.currentTime = 0;

    musicaArcade.play().catch(() => {
        console.warn("No se pudo iniciar la música.");
    });
}

// Detener música.

function detenerMusica() {
    if (!musicaArcade) {
        return;
    }

    musicaArcade.pause();
    musicaArcade.currentTime = 0;
}

// ==========================================
// 5. CONFIGURACIÓN
// ==========================================

const DURACION = 45;
const ANCHO_ESTRELLA = 28;
const VELOCIDAD_CESTA = 450;

const configuraciones = {
    facil: {
        intervalo: 0.80,
        intervaloMinimo: 0.80,
        velocidadMinima: 100,
        velocidadExtra: 65,
        probabilidadMalo: 0.10,
        aceleracion: 0
    },

    normal: {
        intervalo: 0.50,
        intervaloMinimo: 0.40,
        velocidadMinima: 170,
        velocidadExtra: 120,
        probabilidadMalo: 0.22,
        aceleracion: 1
    },

    dificil: {
        intervalo: 0.22,
        intervaloMinimo: 0.14,
        velocidadMinima: 280,
        velocidadExtra: 190,
        probabilidadMalo: 0.35,
        aceleracion: 5
    }
};

const tiposEstrella = [
    {
        clase: "amarilla",
        simbolo: "★",
        puntos: 10
    },
    {
        clase: "rosa",
        simbolo: "✦",
        puntos: 25
    },
    {
        clase: "morada",
        simbolo: "✧",
        puntos: 5
    }
];

const tipoMalo = {
    clase: "roja",
    simbolo: "✹",
    puntos: -20
};

// ==========================================
// 6. VARIABLES DEL JUEGO
// ==========================================

let puntos = 0;
let tiempo = DURACION;

let estrellasAtrapadas = 0;
let malosRecuerdos = 0;
let puntosPerdidos = 0;

let record = 0;

let jugando = false;
let partidaTerminada = false;

let direccion = 0;
let posicionCesta = 0;

let estrellas = [];
let acumulador = 0;

let ultimoTiempo = 0;
let animacion = null;

let dificultadActual = configuraciones.normal;
let dificultadPartida = "normal";

const teclasPresionadas = new Set();

// ==========================================
// 7. RÉCORDS POR DIFICULTAD
// ==========================================

function claveRecord() {
    const dificultad = jugando
        ? dificultadPartida
        : selectorDificultad.value;

    return "paow-atrapaestrellas-record-" + dificultad;
}

function cargarRecord() {
    try {
        record = Number(
            localStorage.getItem(claveRecord())
        ) || 0;

    } catch (error) {
        record = 0;
    }

    recordTexto.textContent = record;
}

function guardarRecord() {
    try {
        const clave =
            "paow-atrapaestrellas-record-" +
            dificultadPartida;

        const mejorAnterior = Number(
            localStorage.getItem(clave)
        ) || 0;

        if (puntos > mejorAnterior) {
            record = puntos;

            localStorage.setItem(
                clave,
                String(record)
            );
        } else {
            record = mejorAnterior;
        }

    } catch (error) {
        console.warn("No se pudo guardar el récord.");
    }
}

// ==========================================
// 8. FUNCIONES AUXILIARES
// ==========================================

function limitar(valor, minimo, maximo) {
    return Math.max(minimo, Math.min(maximo, valor));
}

function actualizarMarcador() {
    puntosTexto.textContent = puntos;
    tiempoTexto.textContent = Math.ceil(tiempo);

    recordTexto.textContent = record;

    estrellasTexto.textContent =
        estrellasAtrapadas;

    malosTexto.textContent =
        malosRecuerdos;

    perdidosTexto.textContent =
        puntosPerdidos;
}

// ==========================================
// 9. MOVIMIENTO DE LA CESTA
// ==========================================

function moverCesta(x) {
    const mitad = cesta.offsetWidth / 2;

    posicionCesta = limitar(
        x,
        mitad,
        Math.max(mitad, campo.clientWidth - mitad)
    );

    cesta.style.left = posicionCesta + "px";
}

// ==========================================
// 10. CREAR ESTRELLAS
// ==========================================

function crearEstrella() {
    let tipo;

    const esMalo =
        Math.random() <
        dificultadActual.probabilidadMalo;

    if (esMalo) {
        tipo = tipoMalo;

    } else {
        const indice = Math.floor(
            Math.random() * tiposEstrella.length
        );

        tipo = tiposEstrella[indice];
    }

    const elemento =
        document.createElement("span");

    elemento.className =
        "estrella " + tipo.clase;

    elemento.textContent = tipo.simbolo;
    elemento.setAttribute("aria-hidden", "true");

    objetos.appendChild(elemento);

    const tiempoTranscurrido =
        DURACION - tiempo;

    const velocidad =
        dificultadActual.velocidadMinima +
        Math.random() *
        dificultadActual.velocidadExtra +
        tiempoTranscurrido *
        dificultadActual.aceleracion;

    estrellas.push({
        x: Math.random() * Math.max(
            0,
            campo.clientWidth - ANCHO_ESTRELLA
        ),

        y: -ANCHO_ESTRELLA,
        velocidad: velocidad,
        puntos: tipo.puntos,
        elemento: elemento
    });
}

// ==========================================
// 11. ELIMINAR OBJETOS
// ==========================================

function eliminarEstrella(indice) {
    estrellas[indice].elemento.remove();
    estrellas.splice(indice, 1);
}

// ==========================================
// 12. ATRAPAR OBJETOS
// ==========================================

function recogerObjeto(estrella) {
    if (estrella.puntos < 0) {

        // MAL RECUERDO

        malosRecuerdos++;

        const puntosAntes = puntos;

        puntos = Math.max(
            0,
            puntos + estrella.puntos
        );

        puntosPerdidos += puntosAntes - puntos;

        reproducirSonido(sonidoMalo);

    } else {

        // ESTRELLA BUENA

        estrellasAtrapadas++;
        puntos += estrella.puntos;

        reproducirSonido(sonidoEstrella);
    }

    actualizarMarcador();
    actualizarEstadoPao();
}

// ==========================================
// 13. ACTUALIZAR ESTRELLAS
// ==========================================

function actualizarEstrellas(delta) {
    const anchoCesta = cesta.offsetWidth;
    const alturaCesta = cesta.offsetHeight;

    const izquierdaCesta =
        posicionCesta - anchoCesta / 2;

    const derechaCesta =
        posicionCesta + anchoCesta / 2;

    const arribaCesta =
        campo.clientHeight -
        12 -
        alturaCesta;

    const abajoCesta =
        campo.clientHeight - 12;

    for (
        let i = estrellas.length - 1;
        i >= 0;
        i--
    ) {
        const estrella = estrellas[i];
        const yAnterior = estrella.y;

        estrella.y +=
            estrella.velocidad * delta;

        estrella.elemento.style.transform =
            `translate(${estrella.x}px, ${estrella.y}px)`;

        const centroX =
            estrella.x + ANCHO_ESTRELLA / 2;

        const centroYAnterior =
            yAnterior + ANCHO_ESTRELLA / 2;

        const centroYActual =
            estrella.y + ANCHO_ESTRELLA / 2;

        const tocaHorizontal =
            centroX >= izquierdaCesta &&
            centroX <= derechaCesta;

        const cruzaCesta =
            centroYAnterior <= abajoCesta &&
            centroYActual >= arribaCesta;

        if (tocaHorizontal && cruzaCesta) {
            recogerObjeto(estrella);
            eliminarEstrella(i);
            continue;
        }

        if (estrella.y > campo.clientHeight) {
            eliminarEstrella(i);
        }
    }
}

// ==========================================
// 14. INICIAR PARTIDA
// ==========================================

function iniciarJuego() {
    if (animacion !== null) {
        cancelAnimationFrame(animacion);
        animacion = null;
    }

    puntos = 0;
    tiempo = DURACION;

    estrellasAtrapadas = 0;
    malosRecuerdos = 0;
    puntosPerdidos = 0;

    direccion = 0;
    acumulador = 0;

    partidaTerminada = false;

    teclasPresionadas.clear();

    dificultadPartida = selectorDificultad.value;

    dificultadActual =
        configuraciones[dificultadPartida] ||
        configuraciones.normal;

    estrellas = [];
    objetos.replaceChildren();

    cargarRecord();
    actualizarMarcador();

    moverCesta(campo.clientWidth / 2);

    jugando = true;
    pantalla.hidden = true;

    selectorDificultad.disabled = true;

    // Reiniciar conversaciones de Pao.

    indiceDialogoPao = 0;
    ultimoComentarioPao = performance.now();

    // Pao siempre está presente.

    cambiarPao(
        "neutral",
        "¡Pao está preparado!",
        "¡Vamos! ¡Atrapa todas las estrellas!"
    );

    // Música y animación.

    iniciarMusica();

    ultimoTiempo = performance.now();

    animacion = requestAnimationFrame(
        actualizarJuego
    );
}

// ==========================================
// 15. BUCLE PRINCIPAL
// ==========================================

function actualizarJuego(ahora) {
    if (!jugando) {
        return;
    }

    const delta = Math.min(
        (ahora - ultimoTiempo) / 1000,
        0.05
    );

    ultimoTiempo = ahora;

    tiempo -= delta;

    if (tiempo <= 0) {
        tiempo = 0;
        terminarJuego();
        return;
    }

    // Movimiento de cesta.

    if (direccion !== 0) {
        moverCesta(
            posicionCesta +
            direccion *
            VELOCIDAD_CESTA *
            delta
        );
    }

    // Más objetos en Normal y Difícil.

    const tiempoTranscurrido =
        DURACION - tiempo;

    let reduccionIntervalo = 0;

    if (
        dificultadActual === configuraciones.dificil ||
        dificultadActual === configuraciones.normal
    ) {
        reduccionIntervalo =
            tiempoTranscurrido * 0.002;
    }

    const intervaloActual = Math.max(
        dificultadActual.intervaloMinimo,
        dificultadActual.intervalo -
        reduccionIntervalo
    );

    acumulador += delta;

    while (acumulador >= intervaloActual) {
        acumulador -= intervaloActual;
        crearEstrella();
    }

    actualizarEstrellas(delta);
    actualizarMarcador();

    // Pao comenta mientras el jugador juega.

    comentarioAutomaticoPao(ahora);

    animacion = requestAnimationFrame(
        actualizarJuego
    );
}

// ==========================================
// 16. FINALIZAR PARTIDA
// ==========================================

function terminarJuego() {
    jugando = false;
    partidaTerminada = true;

    direccion = 0;
    teclasPresionadas.clear();

    if (animacion !== null) {
        cancelAnimationFrame(animacion);
        animacion = null;
    }

    selectorDificultad.disabled = false;

    detenerMusica();
    reproducirSonido(sonidoFinal);

    guardarRecord();
    actualizarMarcador();

    // Pao cambia según el resultado.

    mostrarResultadoPao();

    tituloPantalla.textContent =
        "¡PARTIDA TERMINADA!";

    mensajePantalla.textContent =
        `Puntaje final: ${puntos}. ` +
        `Estrellas atrapadas: ${estrellasAtrapadas}. ` +
        `Malos recuerdos: ${malosRecuerdos}. ` +
        `Puntos perdidos: ${puntosPerdidos}. ` +
        `Récord: ${record}.`;

    botonComenzar.textContent =
        "↺ VOLVER A JUGAR";

    pantalla.hidden = false;
}

// ==========================================
// 17. BOTÓN DE COMENZAR
// ==========================================

botonComenzar.addEventListener(
    "click",
    iniciarJuego
);

// ==========================================
// 18. CAMBIAR DIFICULTAD
// ==========================================

selectorDificultad.addEventListener(
    "change",
    cargarRecord
);

// ==========================================
// 19. TECLADO
// ==========================================

function actualizarDireccion() {
    const izquierda =
        teclasPresionadas.has("a") ||
        teclasPresionadas.has("arrowleft");

    const derecha =
        teclasPresionadas.has("d") ||
        teclasPresionadas.has("arrowright");

    direccion =
        Number(derecha) - Number(izquierda);
}

document.addEventListener("keydown", evento => {
    const tecla = evento.key.toLowerCase();

    if (
        jugando &&
        ["a", "d", "arrowleft", "arrowright"]
            .includes(tecla)
    ) {
        evento.preventDefault();

        teclasPresionadas.add(tecla);
        actualizarDireccion();
    }
});

document.addEventListener("keyup", evento => {
    teclasPresionadas.delete(
        evento.key.toLowerCase()
    );

    actualizarDireccion();
});

// ==========================================
// 20. MOUSE Y PANTALLA TÁCTIL
// ==========================================

function moverConPuntero(evento) {
    if (!jugando) {
        return;
    }

    const rectangulo =
        campo.getBoundingClientRect();

    const x =
        evento.clientX - rectangulo.left;

    direccion = 0;
    moverCesta(x);
}

campo.addEventListener(
    "pointerdown",
    moverConPuntero
);

campo.addEventListener("pointermove", evento => {
    if (!jugando) {
        return;
    }

    if (
        evento.pointerType === "mouse" ||
        evento.buttons > 0
    ) {
        moverConPuntero(evento);
    }
});

// ==========================================
// 21. BOTONES PARA TELÉFONO
// ==========================================

function configurarBoton(boton, sentido) {
    boton.addEventListener(
        "pointerdown",
        evento => {
            if (!jugando) {
                return;
            }

            evento.preventDefault();

            boton.setPointerCapture(
                evento.pointerId
            );

            direccion = sentido;
        }
    );

    function detener() {
        direccion = 0;
    }

    boton.addEventListener(
        "pointerup",
        detener
    );

    boton.addEventListener(
        "pointercancel",
        detener
    );

    boton.addEventListener(
        "lostpointercapture",
        detener
    );
}

configurarBoton(botonIzquierda, -1);
configurarBoton(botonDerecha, 1);

// ==========================================
// 22. EVITAR CONTROLES ATASCADOS
// ==========================================

window.addEventListener("blur", () => {
    direccion = 0;
    teclasPresionadas.clear();
});

// ==========================================
// 23. AJUSTAR VENTANA
// ==========================================

window.addEventListener("resize", () => {
    moverCesta(
        posicionCesta ||
        campo.clientWidth / 2
    );
});

// ==========================================
// 24. INICIALIZACIÓN
// ==========================================

// Centrar cesta.
moverCesta(campo.clientWidth / 2);

// Mostrar récord y marcador.
cargarRecord();
actualizarMarcador();

// Mostrar a Pao desde que abre la página.
cambiarPao(
    "neutral",
    "PAO.EXE ♡",
    "Owa... ¿quieres jugar conmigo? Haz clic en mí."
);
