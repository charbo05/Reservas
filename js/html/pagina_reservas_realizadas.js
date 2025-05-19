"use strict";

const htmlPaginaReservasRealizadas = {

    // PAGINA RESERVAS FINALIZADAS --------------------------------------------------------------------------------

    insertarHtml()
    {
        let _this = htmlPaginaReservasRealizadas;

        let html  = _this.crearHtmlTodos();

        if(html === '')
        {
            html = '<p class="sin-resultados">No se encontraron reservas realizadas</p>';
        }

        util.insertar(
            '#personas-reservas-realizadas .fichas-locales',
            html
        );

        // Event Listener sobre botones (varios botones)
        util.registrarEventosSelector('.busqueda-en-divs',  'keyup', util.filtrarDivsConTexto);

        util.registrarEventosSelector('.filtro-busqueda input', 'click', paginas.actualizarFiltroBusqueda);
        util.registrarEventosSelector('.filtro-busqueda input', 'click', _this.insertarHtml);
    },

    // -----------------------------------------------------------------------------------------------------------
    //

    crearHtmlTodos()
    {
        // -------------------------------------------------------------------------------------------------------
        // Se calculan y obtienen los detalles a mostrar de cada local:
        //  - Mis reservas al local
        //  - Porcentaje de reservas realizadas por mi
        //  - Total de reservas del local
        //  - Otros datos del local

        let _this = htmlPaginaReservasRealizadas;
        let localesDondeRealizoMasReservas = [];                // Lista que guarda el o los locales con más reservas (pueden empatar).
        let maximasReservasEnUnLocal = 0;                       // Se va guardando el máximo de reservas encontrados en un local hasta el momento
        let localesDetalles = [];                               // Lista que guarda los detalles de cada local

        for(let i = 0; i < locales.listaLocales.length; i++)    // Por cada local en lista de locales
        {
            let local = locales.listaLocales[i];                // Se toma el local

            if(paginas.filtroTipoLocal != 'Todos')              // Si hay un filtro por tipo de local
            {
                if( local.tipo.toLowerCase()                            // Tipo local a minúsculas
                 != paginas.filtroTipoLocal.slice(0, -1).toLowerCase()  // distino a filtro tipo local menos la ultima letra (Museo(s) la "s" se saca) a minúsculas
                )
                continue;                                              // Se evita seguir y se pasa al siguiente cilco del for
            }

            let listaReservas = local.obtenerTodasLasReservasDelUsuario(sesion.usuario); // Se obtienen las reservas del usuario en ese local

            if(listaReservas.length === 0)                      // Si no hay reservas para el usuario
            {
                continue;                                       // Se salta el bucle
            }

            let detalles = {};                                  // Se define detalles como un objeto que va a contener los detalles del local
            let sumaReservas = 0;                               // Acumulador para ir sumando las reservas del usuario

            for(let j=0; j < listaReservas.length; j++)         // Por cada reserva encontrada
            {
                sumaReservas++;                                 // Se suma 1 al acumulador
            }

            detalles.local = local;                                  // Se agrega a detalles el local (objeto completo)
            detalles.cantidadTotalReservas = local.reservas.length;  // Se agrega a detalles la cantidad de reservas de TODOS los usuarios
            detalles.cantidadMisReservas   = sumaReservas;           // Se agrega a detalles la cantidad de reservas del usuario
            detalles.porcentajeMisReservas = sumaReservas * 100 / local.reservas.length;  // Se agrega a detalles el porcentaje de reservas del usuario

            if(sumaReservas > maximasReservasEnUnLocal)         // Si la sumas de reservas es la mayor hasta el momento
            {
                maximasReservasEnUnLocal = sumaReservas;        // Se establece como máximo el acutal número de reservas (este local)
            }

            localesDetalles.push(detalles);                     // Se agrega el objeto detalles al array de detalles
        }

        // -------------------------------------------------------------------------------------------------------
        // Se busca y se agrega a la lista el local (o locales) con más reservas

        for(let i = 0; i < localesDetalles.length; i++)             // Por cada local en lista de locales
        {
            let detalle = localesDetalles[i];
            let cantidadMisReservas = detalle.cantidadMisReservas;  // Se obtienen los totales de reservas para ese local (realizadas, finalizadas, pendientes y totales)

            if(cantidadMisReservas == maximasReservasEnUnLocal)     // Si la cantidad de reservas totales del local coincide con el máximo encontrado
            {
                localesDondeRealizoMasReservas.push(detalle.local); // Se agrega al array de máximas reservas (debería ser uno pero pueden ser más (igualados en cantidad de reservas))
            }
        }

        let html = _this.crearHtml(localesDetalles, localesDondeRealizoMasReservas); // Se crea el html

        return html;
    },

    // -----------------------------------------------------------------------------------------------------------
    //

    crearHtml(localesDetalles, localesDondeRealizoMasReservas)
    {
        let htmlDestacados = '';
        let htmlNormales = '';

        for(let i = 0; i < localesDetalles.length; i++)
        {
            let detalles = localesDetalles[i];
            let local    = detalles.local;

            let localDestacado = false;

            // Se determina si es un local destacado (tiene el máximo de reservas realizadas por el usuario)
            for(let j=0; j < localesDondeRealizoMasReservas.length; j++)
            {
                let localMaximo = localesDondeRealizoMasReservas[j];
                if(local === localMaximo)
                {
                    localDestacado = true;
                }
            }

            let imagen = 'img/locales/' + local.foto;
            let tipo   = util.primeraLetraEnMayuscula(local.tipo);

            let promedio       = local.promedioCalificaciones().toFixed(2);
            let nivelEstrellas = util.nivelEstrellas(promedio);
            let nivelBarras    = util.nivelBarras(detalles.porcentajeMisReservas);

            let html = '';

            if(localDestacado)
            {
                html +=  `<div class="ficha-local destacado">`;
            }
            else {
                html +=  '<div class="ficha-local">';
            }

            let estadoUnicaReserva = '';

            if(local.reservas.length == 1 && local.reservas[0].estado != 'finalizada')
            {
                let estado = local.reservas[0].estado;
                estadoUnicaReserva = `<i class="estado ${estado}">Reserva ${estado}</i>`;
            }


            html += `
                    <div class="imagen">
                        <img src="${imagen}" />
                    </div>

                    <div class="detalles">

                        <h3 class="titulo">${local.nombre}</h3>

                        <span class="tipo">${tipo}</span>

                        <div class="estrellas">
                            <span style="background-position:-${nivelEstrellas}px"></span>
                        </div>

                        <div class="resumen-personal">

                            <span class="total-reservas">
                                Total de reservas <b>${detalles.cantidadTotalReservas}</b> ${estadoUnicaReserva}
                            </span>

                            <span class="cantidad-mis-reservas">
                                Mis reservas al local: <b>${detalles.cantidadMisReservas}</b>
                            </span>

                            <span class="porcentaje-mis-reservas">
                                Porcentaje de reservas realizadas por mi:
                                <div class="barra-progreso" style="background-position:-${nivelBarras}px">
                                    <b>${detalles.porcentajeMisReservas.toFixed(0)} %</b>
                                </div>
                            </span>

                        </div>
                    </div>
                </div>
            `;

            if(localDestacado)
            {
                htmlDestacados += html;
            }
            else {
                htmlNormales += html;
            }
        }

        // Si hay locales se encierran los destacados en un div "locales-destacados"
        if((localesDetalles.length > 0))
        {
            let textoSolapaDestacados = 'Local en el que realizó más reservas'

            if(localesDondeRealizoMasReservas.length > 1)
            {
                textoSolapaDestacados = 'Locales en los que realizaron más reservas'
            }

            htmlDestacados = `
                <div id="locales-destacados">
                    <div class="solapa-destacado">
                        ${textoSolapaDestacados}
                    </div>
                    ${htmlDestacados}
                </div>`;
        }

        return htmlDestacados + htmlNormales;
    },

}