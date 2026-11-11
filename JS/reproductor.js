
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
