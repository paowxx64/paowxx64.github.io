
/* ==========================================
   UNDEROMORI - CONSECUENCIAS DEL FINAL
   PÁGINA PRINCIPAL
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    const CLAVE = "underomori-estado-v1";

    let finalElegido = null;

    try {
        const guardado = localStorage.getItem(CLAVE);

        if (guardado) {
            const estado = JSON.parse(guardado);
            finalElegido = estado.finalElegido;
        }
    } catch (error) {
        console.warn("No se pudo leer el final.", error);
    }

    if (
        finalElegido !== "quedarse" &&
        finalElegido !== "despedirse"
    ) {
        return;
    }

    // Esta variable permite cambiar la apariencia
    // de todos los elementos asociados a Paunexina.
    document.documentElement.dataset.underomoriFinal =
        finalElegido;

    // Busca los elementos que hayamos marcado
    // como apariciones de Paunexina.
    const personajes = document.querySelectorAll(
        '[data-personaje="paunexina"]'
    );

    const primero = personajes[0];

    if (finalElegido === "quedarse") {
        if (!primero) return;

        const nota = document.createElement("span");

        nota.className = "paunexina-mensaje-final";
        nota.textContent = "Todavía estoy aquí... ♡";

        primero.insertAdjacentElement("afterend", nota);
        // Cambiar el avatar de inicio por el GIF del Final A
personajes.forEach(personaje => {
    if (personaje.tagName !== "IMG") return;

    const esSobreMi = window.location.pathname
        .toLowerCase()
        .includes("/sobre-mi.html");

    personaje.src = esSobreMi
        ? "../assets/avatar-final-a.gif"
        : "assets/avatar-final-a.gif";
});

    } else {
        // El recuerdo principal solo aparece en index.html
if (!document.querySelector(".bienvenida")) {
    return;
}
        // Crear un recuerdo en el lugar de Paunexina.
        const recuerdo = document.createElement("a");

        recuerdo.href = "juego/capitulo7.html";
        recuerdo.className = "paunexina-recuerdo-final";

        recuerdo.textContent =
            "◇ PAUNEXINA.EXE — ALGUIEN ESTUVO AQUÍ";

        // Si hay un avatar, la memoria aparece
        // inmediatamente después de él.

const bienvenida = document.querySelector(".bienvenida");

if (bienvenida) {
    // Colocar el recuerdo fuera del cuadro oculto
    bienvenida.insertAdjacentElement("afterend", recuerdo);
} else {
    const contenedor =
        document.querySelector("main") ||
        document.body;

    contenedor.appendChild(recuerdo);
}

    }
});
