"use strict";

// PAGINA RESERVAS PENDIENTES --------------------------------------------------------------------------------

const htmlPaginaReservasPendientes = {

    insertarHtml()
    {
        let _this = htmlPaginaReservasPendientes;

        let html  = _this.crearHtmlTodos();

        if(html === '')
        {
            html = '<p class="sin-resultados">No se encontraron reservas pendientes</p>';
        }

        util.insertar(
            '#personas-reservas-pendientes .fichas-locales',
            html
        );

        // Event Listener sobre botones (varios botones)
        util.registrarEventosSelector('.boton-cancelar-reserva', 'click', reservas.cancelar);
        util.registrarEventosSelector('.busqueda-en-divs',  'keyup', util.filtrarDivsConTexto);

        util.registrarEventosSelector('.busqueda-en-divs',  'keyup', util.filtrarDivsConTexto);

        util.registrarEventosSelector('.filtro-busqueda input', 'click', paginas.actualizarFiltroBusqueda);
        util.registrarEventosSelector('.filtro-busqueda input', 'click', _this.insertarHtml);

    },

    crearHtmlTodos()
    {
        let html = '';

        for(let i = 0; i < locales.listaLocales.length; i++)
        {
            // Tomo el local
            let local = locales.listaLocales[i];

            if(paginas.filtroTipoLocal != 'Todos')
            {
                if(
                    local.tipo.toLowerCase()                            // Tipo local a minúsculas
                 != paginas.filtroTipoLocal.slice(0, -1).toLowerCase()  // distino a filtro tipo local menos la ultima
                 )                                                      // letra (Museo(s) la "s" se saca) a minúsculas
                 continue;                                              // Se evita seguir y se pasa al siguiente cilco del for
            }

            html += this.crearHtml(locales.listaLocales[i]);
        }
        return html;
    },

    crearHtml(local)
    {
        // Se intenta obtener una reserva pendiente del usuario en el local (puede no tener)
        let reserva = local.obtenerReservaPendienteDelUsuario(sesion.usuario);

        // Si no tiene se retorna un string vacío
        if(reserva === null)
            return '';

        let nivelEstrellas = util.nivelEstrellas(local.promedioCalificaciones());

        let imagen = 'img/locales/' + local.foto;

        let tipo = util.primeraLetraEnMayuscula(local.tipo);

        // Se le muestra el boton de cancelar la reserva
        let s = reserva.cupos > 1 ? 's' : '';
        let botonCancelar = `<input
                            value="Cancelar reserva${s} (${reserva.cupos})"
                            type="button"
                            class="boton-cancelar-reserva"
                            data-id-local="${local.id}"
                            data-id-reserva="${reserva.id}"
                            onClick="setTimeout(function(){sitio.mostrarPaginaReservasPendientes()},100);"
                        >`;

        return `
            <div class="ficha-local">
                <div class="imagen">
                    <img src="${imagen}" />
                </div>
                <div class="detalles">
                    <h3 class="titulo">${local.nombre}</h3>
                    <span class="tipo">${tipo}</span>
                    <div class="estrellas">
                        <span style="background-position:-${nivelEstrellas}px"></span>
                    </div>
                    ${botonCancelar}
                </div>
            </div>
        `;
    },

}