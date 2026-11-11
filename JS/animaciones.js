
const titulo = document.getElementById("titulo-retro");

if (titulo) {
    const texto = titulo.textContent.trim();

    titulo.textContent = "";
    titulo.setAttribute("aria-label", texto);

    let indice = 0;

    texto.split(" ").forEach((palabra, posicion) => {
        const grupo = document.createElement("span");
        grupo.classList.add("grupo-palabra");
        grupo.setAttribute("aria-hidden", "true");

        for (const letra of palabra) {
            const span = document.createElement("span");

            span.classList.add("letra-retro");
            span.textContent = letra;

            span.style.animationDelay = `${indice * 0.09}s`;

            grupo.appendChild(span);
            indice++;
        }

        titulo.appendChild(grupo);

        if (posicion < texto.split(" ").length - 1) {
            const espacio = document.createElement("span");
            espacio.classList.add("espacio-retro");
            espacio.setAttribute("aria-hidden", "true");
            titulo.appendChild(espacio);
            indice++;
        }
    });
}
