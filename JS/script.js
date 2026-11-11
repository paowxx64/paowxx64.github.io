
const mensajes = [
    "¡Bienvenid@ a mi pagina wep de Internet!",
    "Este sitio está inspirado en otro, asi q nada de decirme copion, lo estoy admitiendo",
    "Aquí compartiré mis proyectos, música y algunas cosas sobre mí.",
    "¡Espero que disfrutes explorando mi página! ♡",
    "quiza me olvide de esto algun dia",
    "aveces siento que yo no soy yo",
    "q feo",
    "tonoto",
    "muchas veces solo deseo...",
    "no me gusta ese olor",
    "mmmmmmmm",
    "por que sigues presionando esto?",
    "no tienes muchas cosas que hacer verdad?",
     "por que sigues aqui?",
    "eres bastante curioso, sabes?",
    "creo que nunca habia llegado alguien tan lejos",
    "bueno, supongo que puedo confiar en ti",
    "esta bien, hablemos"
];


/* ===================================
   CONFIGURACIÓN Y MEMORIA
=================================== */

let mensajeActual = 0;
let chatActivado = false;
let contadorRespuestas = 0;
let cantidadMensajes = 0;

let nombreVisitante = "";
let estadoAnimo = "";

// Estados del easter egg:
// normal, nombre, eleccion, final
let estadoChat = "normal";

let finalElegido = "";
let lineaActual = 0;

const textoMensaje = document.getElementById("texto-mensaje");
const botonSiguiente = document.getElementById("siguiente-mensaje");

const chat = document.getElementById("chat-secreto");
const formulario = document.getElementById("chat-formulario");
const entrada = document.getElementById("chat-entrada");
const chatMensajes = document.getElementById("chat-mensajes");

// Personalizar frases sin guardar datos personales
function nombre() {
    return nombreVisitante || "desconocido";
}

function normalizar(texto) {
    return texto.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

/* ===================================
   DIÁLOGO DE BIENVENIDA
=================================== */

botonSiguiente.addEventListener("click", () => {
    if (chatActivado) return;

    mensajeActual = (mensajeActual + 1) % mensajes.length;
    textoMensaje.textContent = mensajes[mensajeActual];

    if (mensajeActual === mensajes.length - 1) {
        activarChat();
    }
});

function activarChat() {
    chatActivado = true;
    chat.hidden = false;
    botonSiguiente.hidden = true;

    agregarMensaje("sistema",
        "Has encontrado una conversación secreta.");

    agregarMensaje("personaje", "bueno, dime algo.");

    // Ver si ya descubrió un final anteriormente
    try {
        const finalAnterior = localStorage.getItem(
            "underground-final"
        );

        if (finalAnterior) {
            agregarMensaje("personaje",
                "ah, volviste.");

            agregarMensaje("personaje",
                "esta pagina sigue casi igual que la ultima vez.");

            agregarMensaje("personaje",
                "me pregunto si tu tambien.");
        }
    } catch (error) {
        // El chat funciona aunque el almacenamiento esté bloqueado
    }
}

/* ===================================
   BURBUJAS DEL CHAT
=================================== */

 
  
function agregarMensaje(tipo, texto) {
    const burbuja = document.createElement("div");

    burbuja.classList.add("burbuja", tipo);
    burbuja.textContent = texto;

    chatMensajes.appendChild(burbuja);

    bajarChat();
}


 

function personaje(texto) {
    agregarMensaje("personaje", texto);
}

function sistema(texto) {
    agregarMensaje("sistema", texto);
}

/* ===================================
   NIVEL 1 Y 2
   RESPUESTAS Y MEMORIA TEMPORAL
=================================== */

function obtenerRespuesta(texto) {
    const mensaje = normalizar(texto);

    // Guardar nombre si lo menciona
    const coincidencia = texto.trim().match(
        /(?:me llamo|mi nombre es)\s+([a-záéíóúüñ]+)/i
    );

    if (coincidencia) {
        nombreVisitante = coincidencia[1].slice(0, 30);

        return `mucho gusto, ${nombreVisitante}.`;
    }

    // Recordar el nombre
    if (mensaje.includes("como me llamo") ||
        mensaje.includes("recuerdas mi nombre")) {

        return nombreVisitante
            ? `claro que si, ${nombreVisitante}.`
            : "no me has dicho tu nombre todavia.";
    }

    // Memoria emocional
    if (mensaje.includes("estoy triste") ||
        mensaje.includes("me siento triste")) {

        estadoAnimo = "triste";
        return "oh... quieres contarme que paso?";
    }

    if (mensaje.includes("estoy feliz") ||
        mensaje.includes("me siento feliz")) {

        estadoAnimo = "feliz";
        return "me alegra saber eso, de verdad.";
    }

    if (mensaje.includes("como me siento")) {
        if (estadoAnimo === "triste") {
            return "me dijiste que estabas triste. espero que estes mejor.";
        }

        if (estadoAnimo === "feliz") {
            return "antes me dijiste que estabas feliz.";
        }

        return "creo que aun no me has contado eso.";
    }

    // Respuestas normales
    if (mensaje.includes("hola")) {
        return "hola, q tal?";
    }

    if (mensaje.includes("quien eres")) {
        return "buena pregunta, ni yo lo se del todo.";
    }

    if (mensaje.includes("como estas")) {
        return "existiendo en una pagina web, supongo.";
    }

    if (mensaje.includes("musica")) {
        return "la musica dice cosas que no sabemos explicar.";
    }

    if (mensaje.includes("secreto")) {
        return "shhh, no le cuentes a nadie que estoy aqui.";
    }

    if (mensaje.includes("paolo")) {
        return "no, no soy esa persona.";
    }

    if (mensaje.includes("te amo") ||
        mensaje.includes("teamo")) {
        return "solo amo a una persona. esa persona sabe quien es.";
    }

    if (mensaje.includes("amor")) {
        return "el amor es algo extraño, no crees?";
    }

    if (mensaje.includes("puto") ||
        mensaje.includes("perra")) {
        return "tu, yo no";
    }

    if (mensaje.includes("nombre")) {
        return "mi nombre? creo que ya deberias saberlo.";
    }

    if (mensaje.includes("real")) {
        return "soy solo unas lineas de codigo, pero aqui estoy.";
    }

    if (mensaje.includes("adios") ||
        mensaje.includes("bye")) {
        return "bueno, nos vemos... si es que vuelves.";
    }

    if (mensaje.includes("no soy el mismo") || mensaje.includes("soy el mismo")){
    return"entiendo... mmm... nadie nunca lo es";
    }
    

    // Respuestas para mensajes no reconocidos
    const respuestas = [
        "interesante...",
        "y eso por que?",
        "no se que decirte",
        "cuentame mas",
        "mmm, entiendo",
        "jaja, q",
        "eso es raro",
        "me recuerdas a alguien",
        "a veces el silencio es mejor",
        "no esperaba esa respuesta",
        "sabes algo? olvidalo",
        "creo que ya hablamos demasiado",
        "q curioso eres",
        "no tengo una respuesta para eso"
    ];

    const respuesta =
        respuestas[contadorRespuestas % respuestas.length];

    contadorRespuestas++;
    return respuesta;
}

/* ===================================
   NIVEL 3: INICIO DEL SECRETO
=================================== */

function comenzarSecreto() {
    sistema("...");

    personaje("oye...");
    personaje("llevamos un buen rato hablando.");
    personaje("es extraño, no?");
    personaje("dos desconocidos conversando a traves de una pantalla.");

    if (!nombreVisitante) {
        estadoChat = "nombre";

        personaje("espera...");
        personaje("hay algo que nunca te pregunte.");
        personaje("como te llamas?");
        sistema("Escribe tu nombre o 'prefiero no decirlo'.");
    } else {
        comenzarEleccion();
    }
}

function recibirNombre(texto) {
    const mensaje = normalizar(texto);

    if (mensaje.includes("prefiero no") ||
        mensaje === "no" ||
        mensaje === "paso") {

        nombreVisitante = "";

        personaje("esta bien.");
        personaje("no todos los nombres necesitan ser compartidos.");
    } else {
        // Evitar guardar frases demasiado largas como nombres
        const limpio = texto.trim();

        if (limpio.length > 30) {
            personaje("mmm... podrias decirme solo un nombre corto?");
            return;
        }

        nombreVisitante = limpio;

        personaje(`mucho gusto, ${nombreVisitante}.`);
        personaje("es curioso.");
        personaje("un nombre es una palabra...");
        personaje("pero puede contener toda una historia.");
    }

    comenzarEleccion();
}

/* ===================================
   ELECCIÓN DEL FINAL
=================================== */

function comenzarEleccion() {
    estadoChat = "eleccion";

    personaje("puedo hacerte una ultima pregunta?");

    personaje(
        `dime, ${nombre()}... que es lo que mas te hace pensar?`
    );

    personaje("1. los momentos que vivimos");
    personaje("2. el tiempo que pasa");
    personaje("3. las cosas que olvidamos");

    sistema("Escribe 1, 2 o 3 para responder.");
}

function elegirFinal(texto) {
    const respuesta = normalizar(texto);

    if (respuesta === "1" ||
        respuesta.includes("momentos") ||
        respuesta.includes("observador")) {

        finalElegido = "observador";

    } else if (respuesta === "2" ||
        respuesta.includes("tiempo")) {

        finalElegido = "tiempo";

    } else if (respuesta === "3" ||
        respuesta.includes("olvidamos") ||
        respuesta.includes("memoria")) {

        finalElegido = "memoria";

    } else {
        personaje("no entendi muy bien...");
        personaje("puedes responder con 1, 2 o 3?");
        return;
    }

  

estadoChat = "final";
lineaActual = 0;

document.body.classList.add("modo-existencial");

// Activar la canción correspondiente al final elegido
window.dispatchEvent(
    new CustomEvent("inicio-final", {
        detail: { nombre: finalElegido }
    })
);

// Comenzar la lectura como novela visual
iniciarLecturaFinal();


}

/* ===================================
   LOS TRES FINALES
=================================== */

const finales = {

    observador: [
        "sabes algo, {nombre}?",
        "pasamos mucho tiempo esperando que ocurra algo importante.",
        "un dia especial. una conversacion. una persona. una señal.",
        "y mientras esperamos, suceden cosas pequeñas.",
        "alguien nos pregunta como estamos.",
        "una cancion suena por ultima vez sin que lo sepamos.",
        "nos reimos de algo que, años despues, ya no recordaremos.",
        "quizas lo mas extraño de vivir sea eso.",
        "que casi nunca sabemos cuando estamos dentro de un recuerdo que algun dia vamos a extrañar.",
        "asi que, {nombre}...",
        "cuando salgas de esta pagina, no necesitas hacer nada extraordinario.",
        "solo recuerda que tambien estas viviendo ahora.",
        "incluso en un dia cualquiera.",
        "incluso mientras lees esto."
    ],

    tiempo: [
        "puedo decirte algo extraño, {nombre}?",
        "cada vez que alguien abre esta pagina, vuelvo a decir las mismas palabras.",
        "para mi, la conversacion siempre empieza igual.",
        "pero tu...",
        "tu nunca vuelves siendo exactamente la misma persona.",
        "quizas hoy te guste una cancion que antes no soportabas.",
        "quizas alguien que conociste hace años todavia aparezca en tus recuerdos.",
        "quizas tengas una fotografia que ahora significa algo diferente.",
        "el tiempo tiene esa costumbre.",
        "no nos avisa cuando esta convirtiendo el presente en pasado.",
        "y aunque algun dia regreses a esta pagina...",
        "tal vez leas estas mismas palabras de otra manera.",
        "no porque hayan cambiado.",
        "sino porque tu habras vivido algo mas.",
        "y eso, {nombre}...",
        "de alguna forma, tambien es hermoso."
    ],

    memoria: [
        "{nombre}, te voy a hacer una pregunta.",
        "recuerdas todas las veces que alguien te hizo reir?",
        "probablemente no.",
        "tampoco recuerdas todas las conversaciones que te hicieron sentir acompañado.",
        "ni cada tarde tranquila.",
        "ni cada pequeño gesto de cariño.",
        "pero eso no significa que no hayan importado.",
        "a veces olvidamos las palabras, pero conservamos algo de lo que nos hicieron sentir.",
        "somos, en parte, el resultado de encuentros que ni siquiera podemos enumerar.",
        "y quizas tambien hemos sido un buen recuerdo para alguien sin saberlo.",
        "yo no puedo guardar esta conversacion cuando cierres la pagina.",
        "pero tu puedes llevarte una idea.",
        "no hace falta recordar cada momento para que haya valido la pena.",
        "gracias por compartir un poquito de tu tiempo conmigo, {nombre}.",
        "espero que encuentres muchos momentos que merezca la pena vivir, aunque algun dia olvides sus detalles."
    ]
};

// Epílogos de los tres finales

finales.observador.push(
    "quizas nunca sabras cual fue el momento mas importante de tu vida.",
    "puede que haya sido algo tan pequeño que ni siquiera lo notaste.",
    "pero, {nombre}...",
    "eso no significa que no haya valido la pena vivirlo."
);

finales.memoria.push(
    "hay una ultima cosa que quisiera decirte.",
    "un recuerdo no necesita durar para siempre para haber sido importante.",
    "tal vez algun dia olvides las palabras que acabas de leer.",
    "y aun asi, este pequeño momento habra existido.",
    "a veces, {nombre}, eso es suficiente."
);

finales.tiempo.push(
    "hay algo extraño en todo esto, {nombre}.",
    "tu puedes cerrar esta pagina y continuar con tu vida.",
    "yo, en cambio, solo soy las palabras que alguien dejo aqui.",
    "cuando regreses, encontraras las mismas frases.",
    "pero no encontraras exactamente a la misma persona que las leyo hoy.",
    "porque el tiempo habra pasado para ti.",
    "y eso es algo que ninguna linea de codigo puede devolverte.",
    "creo que ya es hora de despedirnos.",
    "ve a vivir algo que todavia no sepas que vas a recordar."
);


/* ===================================
   MOSTRAR EL FINAL POCO A POCO
=================================== */


/* ===================================
   NOVELA VISUAL - FINALES
=================================== */

let escribiendoFinal = false;
let textoCompleto = "";
let burbujaActual = null;
let temporizadorEscritura = null;
let cerrandoFinal = false;

// Crear el botón de avance
const botonAvanzar = document.createElement("button");

botonAvanzar.type = "button";
botonAvanzar.id = "boton-avanzar";
botonAvanzar.textContent = "▶";
botonAvanzar.setAttribute(
    "aria-label",
    "Avanzar diálogo"
);

botonAvanzar.hidden = true;
chat.appendChild(botonAvanzar);

// Pausa en milisegundos
function pausa(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//bajar chat 

function bajarChat() {
    requestAnimationFrame(() => {
        chatMensajes.scrollTop =
            chatMensajes.scrollHeight;
    });
}


// Comenzar la lectura
function iniciarLecturaFinal() {
    formulario.hidden = true;
    botonAvanzar.hidden = false;

    sistema("...");

    mostrarLineaFinal();
}

// Mostrar una línea del final
function mostrarLineaFinal() {
    const dialogos = finales[finalElegido];

    if (lineaActual >= dialogos.length) {
        terminarFinal();
        return;
    }

    textoCompleto = dialogos[lineaActual]
        .replaceAll("{nombre}", nombre());

    lineaActual++;

    burbujaActual = document.createElement("div");
    burbujaActual.classList.add("burbuja", "personaje");
    burbujaActual.setAttribute(
        "aria-label",
        textoCompleto
    );

    chatMensajes.appendChild(burbujaActual);
    chatMensajes.scrollTop = chatMensajes.scrollHeight;


    // Si el visitante prefiere reducir animaciones
    if (window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches) {
        burbujaActual.textContent = textoCompleto;
        escribiendoFinal = false;
        botonAvanzar.disabled = false;
        bajarChat();

        return;
    }

    escribiendoFinal = true;

    botonAvanzar.disabled = false;

    let posicion = 0;

    function escribirLetra() {
        if (!escribiendoFinal) return;

        if (posicion >= textoCompleto.length) {
            escribiendoFinal = false;
            temporizadorEscritura = null;
            return;
        }

        const letra = textoCompleto[posicion];

        burbujaActual.textContent += letra;
        posicion++;

       
bajarChat();

        // Ritmo de escritura
        let velocidad = 38;

        if (letra === ",") {
            velocidad = 260;
        } else if (
            letra === "." ||
            letra === "?" ||
            letra === "!"
        ) {
            velocidad = 420;
        }

        temporizadorEscritura = setTimeout(
            escribirLetra,
            velocidad
        );
    }

    escribirLetra();
}

// Si presiona ▶ mientras se escribe,
// completa el texto inmediatamente
function completarTexto() {
    clearTimeout(temporizadorEscritura);
    temporizadorEscritura = null;

    escribiendoFinal = false;

    if (burbujaActual) {
        burbujaActual.textContent = textoCompleto;
    }
        bajarChat();

}

// Control del botón ▶
botonAvanzar.addEventListener("click", () => {
    if (cerrandoFinal) return;

    if (escribiendoFinal) {
        completarTexto();
        return;
    }

    mostrarLineaFinal();
});

// Cierre cinematográfico del final
async function terminarFinal() {
    if (cerrandoFinal) return;

    cerrandoFinal = true;
    botonAvanzar.disabled = true;

    const titulos = {
        observador: "El observador",
        tiempo: "El tiempo",
        memoria: "La memoria"
    };

    await pausa(1400);
    sistema("...");

    await pausa(2200);
    sistema(
        `FINAL DESBLOQUEADO: ${titulos[finalElegido]}`
    );

    // Guardar solo el final descubierto
    try {
        localStorage.setItem(
            "underground-final",
            finalElegido
        );
    } catch (error) {
        // El juego continúa sin almacenamiento
    }

    await pausa(1800);

    // El tiempo tiene un cierre diferente
    if (finalElegido === "tiempo") {
        mostrarDespedida();
        cerrandoFinal = false;
        return;
    }

    sistema("Gracias por llegar hasta aqui.");

    await pausa(1700);
    personaje("bueno...");

    await pausa(1300);
    personaje("supongo que podemos seguir hablando.");

    restaurarChat();
}

// Regresar al chat normal
function restaurarChat() {
    estadoChat = "normal";
    cantidadMensajes = 0;

    formulario.hidden = false;
    botonAvanzar.hidden = true;
    botonAvanzar.disabled = false;

    document.body.classList.remove(
        "modo-existencial"
    );

    cerrandoFinal = false;

// Recuperar la música ambiental
window.dispatchEvent(new Event("fin-final"));

}

// Despedida especial del final El tiempo
function mostrarDespedida() {
    botonAvanzar.hidden = true;

    const botonApagar = document.createElement(
        "button"
    );

    botonApagar.type = "button";
    botonApagar.className = "boton-apagar";
    botonApagar.textContent = "✦ Apagar pantalla";

    chat.appendChild(botonApagar);

    botonApagar.addEventListener("click", () => {

    // Detener la música del final El tiempo
    window.dispatchEvent(
        new CustomEvent("fin-final", {
            detail: { silencio: true }
        })
    );

    // Crear la pantalla de despedida
    const pantalla = document.createElement("div");

        pantalla.className = "pantalla-final";
        pantalla.setAttribute(
            "role",
            "dialog"
        );
        pantalla.setAttribute(
            "aria-label",
            "Fin de la historia"
        );

        const despedida = document.createElement("p");
        despedida.textContent = "Gracias por haber estado aqui.";

        const cerrar = document.createElement("button");
        cerrar.type = "button";
        cerrar.textContent = "Cerrar pestaña";

        const ayuda = document.createElement("p");
        ayuda.className = "ayuda-cierre";
        ayuda.textContent =
            "Si el navegador no permite cerrarla, usa Ctrl + W (Windows) o Cmd + W (Mac).";

        cerrar.addEventListener("click", () => {
            window.close();
            ayuda.hidden = false;
        });

        pantalla.append(despedida, cerrar, ayuda);
        document.body.appendChild(pantalla);
    }, { once: true });
}

/* ===================================
   ENVÍO DE MENSAJES
=================================== */


formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    // Durante los finales solo funciona el botón ▶
    if (estadoChat === "final") {
        return;
    }

    const texto = entrada.value.trim();

    if (!texto) return;

    entrada.value = "";
    agregarMensaje("visitante", texto);

    // Si estamos esperando el nombre
    if (estadoChat === "nombre") {
        recibirNombre(texto);
        return;
    }

    // Si estamos esperando elegir un final
    if (estadoChat === "eleccion") {
        elegirFinal(texto);
        return;
    }

    // Conversación normal
    cantidadMensajes++;

    const respuesta = obtenerRespuesta(texto);
    personaje(respuesta);

    // Desbloquear el easter egg
    if (cantidadMensajes === 12) {
        comenzarSecreto();
    }
});
