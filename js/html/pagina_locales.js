"use strict";

// HTML PARA PAGINA ADMINISTRACION DEL LOCAL ---------------------------------------------------------------------------

const htmlPaginaLocales = {

    insertarHtml()
    {
        let _this = htmlPaginaLocales;

        util.insertar(
            '#locales-informacion',
            _this.crearHtmlInformacionGeneral(sesion.usuario.entidad)
        );

        util.insertar(
            '#locales-configuracion',
            _this.crearHtmlConfiguracion(sesion.usuario.entidad)
        );

        util.insertar(
            '#locales-gestion-reservas',
            _this.crearHtmlGestionReservas(sesion.usuario.entidad)
        );

        util.insertar(
            '#locales-informacion-general',
            _this.crearHtmlInformacionEstadistica()
        );

        util.obtenerPorId('boton-guardar-configuracion')
            .addEventListener('click', locales.guardarConfiguracion);

        util.registrarEventosSelector('.boton-finalizar-reserva', 'click', reservas.finalizar);

        util.registrarEventosSelector('.resaltar-en-tabla', 'keyup', util.destacarFilasTabla);

        util.registrarEventosSelector('.busqueda-en-tabla',  'keyup', util.filtrarFilasTabla);

    },

    crearHtmlInformacionGeneral(local)
    {
        let promedio = local.promedioCalificaciones().toFixed(2);

        let ocupacion = local.porcentajeOcupacion().toFixed(2);

        let totales = local.totalesReservas();

        let nivelEstrellas  = util.nivelEstrellas(promedio);
        let nivelBarras     = util.nivelBarras(ocupacion);

        // Porcentaje de calificaciones
        let positivas = promedio * 100 / 5;
        let negativas = 100 - positivas;

        if(promedio == 0)
            negativas = 0;

        return `

            <li>
                Nombre: <b>${local.nombre}</b>
            </li>

            <li>
                Porcentaje de ocupación:
                <div class="barra-progreso" style="background-position:-${nivelBarras}px">${ocupacion} %</div>
                <span>(${local.cuposOcupados()} Ocupados / ${local.cuposLibres()} libres)</span>
            </li>

            <li>Promedio de calificaciones:
                <div class="estrellas">
                    <span style="background-position:-${nivelEstrellas}px"></span>
                </div>
                <b>${promedio}</b> <span>(${positivas.toFixed(1)}% Positivo / ${negativas.toFixed(1)}% Negativo)<span>
            </li>

            <li>
                Total de reservas realizadas: <b>${totales.total}</b> <span>(${totales.pendientes} pendientes / ${totales.finalizadas} finalizadas / ${totales.canceladas} canceladas)</span>
            </li>

        `;
    },

    crearHtmlConfiguracion(local)
    {
        let habilitado = local.reservasHabilitadas ? 'checked' : '';

        return `

            <li>
                Cupo máximo de reservas: <input id="cupo-maximo" class="cupos" type="number" value="${local.cupoMaximo}">
            </li>

            <li>
                <input type="checkbox" id="reservas-habilitadas" ${habilitado} > Solicitud de reservas habilitada
            </li>

            <li>
                <!-- BOTON -->
                <input
                    type="button"
                    id="boton-guardar-configuracion"
                    data-id-local="${local.id}"
                    class="boton-comun"
                    value="Guardar configuración">
            </li>
        `;
    },

    crearHtmlGestionReservas(local)
    {
        let html = '';
        let reserva;
        let reservas = local.obtenerReservasPendientes();

        if(local.cuposOcupados() == 0)
        {
            return 'No se encotraron reservas pendientes'
        }

        html += `<input
                    type="text"
                    class="campo-busqueda busqueda-en-tabla"
                    placeholder="Buscar por nombre de cliente"
                    data-id-tabla="local-tabla-gestion-reservas"
                    data-columna-tabla="1"
                >`;

        html += '<div class="lista-locales">';

        html += `<table id="local-tabla-gestion-reservas">
                    <thead>
                        <th>Cliente</th> <th>Cupos</th> <th></th>
                    </thead>
                    <tbody>`;

        for(let i = 0; i < reservas.length; i++)
        {
            reserva = reservas[i];

            html += `
                    <tr>
                        <td>${reserva.usuario.entidad.nombreApellido()}</td>
                        <td>${reserva.cupos}</td>
                        <td>
                            <!-- BOTON -->
                            <input
                                type="button"
                                class="boton-finalizar-reserva boton-comun"
                                data-id-reserva="${reserva.id}"
                                data-id-local="${local.id}"
                                value="Finalizar reserva"
                            >
                        </td>
                    </tr>`;
        }

        html +=  `</tbody>
                </table>
                </div>`;

        return html;
    },

    crearHtmlInformacionEstadistica()
    {
        let html = '';
        let local;

        let listaLocales = locales.listaLocales;

        html += '<h4>Calificaciones</h4>';

        html += `<input
                    type="text"
                    class="campo-busqueda resaltar-en-tabla"
                    data-id-tabla="local-tabla-informacion-estadistica"
                    data-columna-tabla="1"
                    placeholder="Resaltar por nombre de local"
                >`;

        html += '<div class="lista-locales">';

        html += `<table id="local-tabla-informacion-estadistica">
                    <thead>
                        <th>Local</th> <th>Tipo</th> <th>Promedio</th> <th>Estrellas</th>
                    </thead>
                    <tbody>`;

        for(let i=0; i < listaLocales.length; i++)
        {
            local = listaLocales[i];

            let promedio = local.promedioCalificaciones().toFixed(2);
            let nivelEstrellas  = util.nivelEstrellas(promedio);

            html += `
                    <tr>
                        <td>${listaLocales[i].nombre}</td>
                        <td>${util.primeraLetraEnMayuscula(listaLocales[i].tipo)}</td>
                        <td>${promedio}</td>
                        <td>
                            <div class="estrellas">
                                <span style="background-position:-${nivelEstrellas}px"></span>
                            </div>
                        </td>
                    </tr>`;
        }

        html +=  `</tbody>
                </table>
                </div>`;

        return html;
    },

}