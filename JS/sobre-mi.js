
/* ========================================
   SISTEMA DE ARCHIVOS - SOBRE MÍ
======================================== */

// Obtener los botones
const botones = document.querySelectorAll(".boton-archivo");

// Obtener las secciones
const secciones = document.querySelectorAll(".panel-info");

// Nombre del archivo activo
const nombreArchivo = document.getElementById("nombre-archivo");

// Al presionar cualquier botón
botones.forEach(boton => {

    boton.addEventListener("click", () => {

        // Saber qué sección eligió el visitante
        const seccionElegida = boton.dataset.seccion;

        // Quitar el estado activo de todos los botones
        botones.forEach(b => {
            b.classList.remove("activo");
            b.setAttribute("aria-pressed", "false");
        });

        // Marcar el botón seleccionado
        boton.classList.add("activo");
        boton.setAttribute("aria-pressed", "true");

        // Ocultar todas las secciones
        secciones.forEach(seccion => {
            seccion.hidden = true;
        });

        // Mostrar la sección seleccionada
        const panel = document.getElementById(seccionElegida);

        if (panel) {
            panel.hidden = false;
        }

        // Cambiar el nombre del archivo en la parte inferior
        nombreArchivo.textContent = seccionElegida + ".txt";

    });

});
