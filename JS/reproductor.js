
/* ===================================
   REPRODUCTOR DE MÚSICA
=================================== */

const musicaFondo = document.getElementById("musica-fondo");
const botonMusica = document.getElementById("boton-musica");

// Volumen inicial: 25 %
musicaFondo.volume = 0.25;

botonMusica.addEventListener("click", async () => {
    if (musicaFondo.paused) {
        try {
            await musicaFondo.play();
        } catch (error) {
            console.error("No se pudo reproducir la música:", error);
        }
    } else {
        musicaFondo.pause();
    }
});

// Actualizar el botón según el estado real
function actualizarBotonMusica() {
    const reproduciendo = !musicaFondo.paused;

    botonMusica.textContent = reproduciendo ? "♫ ❚❚" : "♫ ▶";
    botonMusica.setAttribute(
        "aria-label",
        reproduciendo ? "Pausar música" : "Reproducir música"
    );
    botonMusica.setAttribute(
        "aria-pressed",
        String(reproduciendo)
    );
}

musicaFondo.addEventListener("play", actualizarBotonMusica);
musicaFondo.addEventListener("pause", actualizarBotonMusica);
musicaFondo.addEventListener("ended", actualizarBotonMusica);



/* ===================================
   MÚSICA DE LOS FINALES SECRETOS
=================================== */


const cancionesFinales = {
    observador: "assets/observador.mp3",
    tiempo: "assets/tiempo.mp3",
    memoria: "assets/memoria.mp3"
};


const cancionNormal = "assets/lain_music.mp3";


async function cambiarCancion(ruta) {

    const estabaSonando = !musicaFondo.paused;

    console.log("Cambiando música a:", ruta);
    console.log("Estaba sonando:", estabaSonando);

    // Cambiar la canción
    musicaFondo.pause();
    musicaFondo.src = ruta;
    musicaFondo.load();

    // Mantener el volumen
    musicaFondo.volume = 0.25;

    // Reproducir si la música estaba activada
    if (estabaSonando) {
        try {
            await musicaFondo.play();
            console.log("Canción reproduciéndose:", ruta);
        } catch (error) {
            console.error(
                "Error al reproducir la canción:",
                error
            );
        }
    }
}


// Cambiar la canción cuando comienza un final
window.addEventListener("inicio-final", (evento) => {
    const nombreFinal = evento.detail.nombre;
    const cancion = cancionesFinales[nombreFinal];

    if (cancion) {
        cambiarCancion(cancion);
    }
});

window.addEventListener("fin-final", (evento) => {

    // Final El tiempo: detener la música
    if (evento.detail?.silencio === true) {
        musicaFondo.pause();

        // Preparar la canción normal sin reproducirla
        musicaFondo.src = cancionNormal;
        musicaFondo.load();

        return;
    }

    // Observador y Memoria: volver a la música normal
    cambiarCancion(cancionNormal);
});