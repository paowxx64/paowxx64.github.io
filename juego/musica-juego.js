
/* ======================================
   UNDEROMORI - MÚSICA DEL JUEGO
====================================== */

document.addEventListener("DOMContentLoaded", () => {

    const capitulo = document.body.dataset.capitulo;

    const canciones = {
        "1": "audio/capitulo1.mp3",
        "2": "audio/capitulo2.mp3",
        "3": "audio/capitulo3.mp3",
        "4": "audio/capitulo4.mp3",
        "5": "audio/capitulo5.mp3",
        "6": "audio/capitulo6.mp3",
        "7": "audio/capitulo7.mp3"
    };

    const audio = new Audio(
        canciones[capitulo] || canciones["1"]
    );

    audio.loop = true;
    audio.volume = 0.25;

    // Iniciar la música con la primera interacción
    let musicaIniciada = false;

    async function iniciarMusica() {
        if (musicaIniciada) return;

        try {
            await audio.play();
            musicaIniciada = true;
            boton.textContent = "♫ PAUSAR MÚSICA";
        } catch (error) {
            console.warn("La música aún no puede iniciar.", error);
        }
    }

    document.addEventListener("keydown", iniciarMusica, {
        once: true
    });

    document.addEventListener("click", iniciarMusica, {
        once: true
    });


    const boton = document.createElement("button");

    boton.type = "button";
    boton.className = "boton-musica-juego";
    boton.textContent = "♫ ACTIVAR MÚSICA";

    document.body.appendChild(boton);

    boton.addEventListener("click", async () => {

        if (audio.paused) {
            try {
                await audio.play();

                boton.textContent = "♫ PAUSAR MÚSICA";
            } catch (error) {
                console.warn(
                    "No se pudo reproducir la música.",
                    error
                );
            }
        } else {
            audio.pause();

            boton.textContent = "♫ ACTIVAR MÚSICA";
        }
    });

    // Permitir cambiar la música durante
    // el capítulo final.
    window.cambiarMusicaJuego = async function(ruta) {
        const estabaReproduciendo = !audio.paused;

        audio.pause();
        audio.src = ruta;
        audio.load();

        if (estabaReproduciendo) {
            try {
                await audio.play();
            } catch (error) {
                console.warn(
                    "No se pudo cambiar la música.",
                    error
                );
            }
        }
    };
});
