"use strict";

const mensajero = {

    agregarMensaje(titulo, mensaje, tipo, remover = true)
    {
        let id = 'mensaje' + Math.random().toString(16).slice(2);

        document.querySelector('#mensajero').innerHTML += `

            <div id="${id}" class="mensaje">
                <div class="contenedor ${tipo}">
                    <i onClick="javascript:mensajero.remover('${id}')"></i>
                    <h5>${titulo}</h5>
                    <p>${mensaje}</p>
                </div>
            </div>`;

        if(remover)
        {
            setTimeout(function() {
                if(document.querySelector('#'+id) !== null)
                   document.querySelector('#'+id).remove();
            }, 3000);
        }

    },

    remover(id)
    {
        document.getElementById(id).remove();
    },

    mostrarExito(mensaje, titulo = null, remover = true)
    {
        titulo = titulo === null ? 'Exito' : titulo;
        this.agregarMensaje(titulo, mensaje, 'exito', remover)
    },

    mostrarError(mensaje, titulo = null, remover = true)
    {
        titulo = titulo === null ? 'Error' : titulo;
        this.agregarMensaje(titulo, mensaje, 'error', remover)
    },

    mostrarAdvertencia(mensaje, titulo = null, remover = true)
    {
        titulo = titulo === null ? 'Advertencia' : titulo;
        this.agregarMensaje(titulo, mensaje, 'advertencia', remover)
    },

    mostrarInformacion(mensaje, titulo = null, remover = true)
    {
        titulo = titulo === null ? 'Información' : titulo;
        this.agregarMensaje(titulo, mensaje, 'informacion', remover)
    },

}