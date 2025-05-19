"use strict";

// PAGINA PRINCIPAL ------------------------------------------------------------------------------------------

const htmlPaginaPrincipal = {

    insertarHtml()
    {
        let _this = htmlPaginaPrincipal;

        util.insertar(
            '#principal .fichas-locales',
            _this.crearHtmlTodos()
        );

        // Event Listener sobre botones (varios botones)
        util.registrarEventosSelector('.boton-reserva', 'click', reservas.reservar);
        util.registrarEventosSelector('.boton-cancelar-reserva', 'click', reservas.cancelar);
        util.registrarEventosSelector('.busqueda-en-divs',  'keyup', util.filtrarDivsConTexto);

        util.registrarEventosSelector('.filtro-busqueda input', 'click', paginas.actualizarFiltroBusqueda);
        util.registrarEventosSelector('.filtro-busqueda input', 'click', _this.insertarHtml);
    },

    crearHtmlTodos()
    {
        let html = '';

        for(let i=0; i < locales.listaLocales.length; i++)
        {
            let local = locales.listaLocales[i];
            if(paginas.filtroTipoLocal != 'Todos')
            {
                if(
                    local.tipo.toLowerCase()                            // Tipo local a minúsculas
                 != paginas.filtroTipoLocal.slice(0, -1).toLowerCase()  // distino a filtro tipo local menos la ultima
                 )                                                      // letra (Museo(s) la "s" se saca) a minúsculas
                 continue;                                              // Se evita seguir y se pasa al siguiente cilco del for
            }

            html += this.crearHtml(local);

        }
        return html;
    },

    crearHtml(local)
    {

        let nivelEstrellas = util.nivelEstrellas(local.promedioCalificaciones());

        let imagen = 'img/locales/' + local.foto;

        let tipo = util.primeraLetraEnMayuscula(local.tipo);

        // Campos de reserva
        let camposReserva = '';

        // Si la sesión está iniciada y es una persona
        if(sesion.iniciada && sesion.usuario.esPersona())
        {
            // Se intenta obtener una reserva pendiente para el usuario
            let reserva = local.obtenerReservaPendienteDelUsuario(sesion.usuario);

            // Si las reservas NO estan habilitadas
            if(local.reservasHabilitadas === false)
            {
                // Se muestra mensaje
                camposReserva = 'De momento las reservas para este local no están disponibles';
            }
            else // Si las reservas están habilitadas
            {
                // Si el suario NO tiene reserva pendiente en el local
                if(reserva === null)
                {
                    // Se muestran los campos para hacer reserva
                    camposReserva = `Cantidad de personas:
                                    <input
                                        id="cupos_${local.id}"
                                        value="1"
                                        type="number"
                                        class="cupos"
                                        min="1"
                                    >
                                    <input
                                        value="Reservar"
                                        type="button"
                                        class="boton-comun boton-reserva"
                                        data-id-local="${local.id}"
                                    >`;
                }
            }

            if(reserva !== null) // Si el usuario ya tiene reserva pendiente en el local
            {
                // Se le muestra el boton de cancelar la reserva
                let s = reserva.cupos > 1 ? 's' : '';
                camposReserva = `<input
                                    value="Cancelar reserva${s} (${reserva.cupos})"
                                    type="button"
                                    class="boton-cancelar-reserva"
                                    data-id-local="${local.id}"
                                    data-id-reserva="${reserva.id}"
                                >`;
            }
        }

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
                    ${camposReserva}
                </div>
            </div>
        `;
    },

}