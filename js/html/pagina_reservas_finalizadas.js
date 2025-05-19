"use strict";

const htmlPaginaReservasFinalizadas = {

    // PAGINA RESERVAS FINALIZADAS --------------------------------------------------------------------------------

    insertarHtml()
    {
        let _this = htmlPaginaReservasFinalizadas;

        let html  = _this.crearHtmlTodos();

        if(html === '')
        {
            html = '<p class="sin-resultados">No se encontraron reservas finalizadas</p>';
        }

        util.insertar(
            '#personas-reservas-finalizadas .fichas-locales',
            html
        );

        // Event Listener sobre botones (varios botones)
        util.registrarEventosSelector('.busqueda-en-divs',  'keyup', util.filtrarDivsConTexto);

        util.registrarEventosSelector('.boton-estrellas-puntuacion', 'mouseover', _this.mouseSobreBotonEstrella);
        util.registrarEventosSelector('.estrellas-puntuacion', 'mouseleave',      _this.mouseSaleDeBotonEstrella);
        util.registrarEventosSelector('.boton-estrellas-puntuacion', 'click',     _this.puntuarReserva);

        util.registrarEventosSelector('.filtro-busqueda input', 'click', paginas.actualizarFiltroBusqueda);
        util.registrarEventosSelector('.filtro-busqueda input', 'click', _this.insertarHtml);
    },

    crearHtmlTodos()
    {
        let html = '';
        let local = null;
        let reserva = null;
        let listaReservas = null;

        // Por cada local en lista de locales
        for(let i = 0; i < locales.listaLocales.length; i++)
        {
            // Tomo el local
            local = locales.listaLocales[i];

            if(paginas.filtroTipoLocal != 'Todos')
            {
                if(
                    local.tipo.toLowerCase()                            // Tipo local a minúsculas
                 != paginas.filtroTipoLocal.slice(0, -1).toLowerCase()  // distino a filtro tipo local menos la ultima
                 )                                                      // letra (Museo(s) la "s" se saca) a minúsculas
                 continue;                                              // Se evita seguir y se pasa al siguiente cilco del for
            }

            // Obtengo las reservas del usuario en ese local
            listaReservas = local.obtenerReservasFinalizadasDelUsuario(sesion.usuario);

            // Si no hay reservas para el usuario salto el ciclo y paso al siguiente
            if(listaReservas.length === 0)
                continue;

            // Por cada reserva
            for(let j=0; j < listaReservas.length; j++)
            {
                reserva = listaReservas[j];
                // Se crea el html
                html = this.crearHtml(local, reserva) + html;
            }
        }
        return html;
    },

    crearHtml(local, reserva)
    {
        let imagen = 'img/locales/' + local.foto;

        let tipo = util.primeraLetraEnMayuscula(local.tipo);

        let estrellas = '';

        if(reserva.puntos == 0)
        {
            let estrellasPuntuacion = this.crearBotonesEstrellasPuntaje(local.id, reserva.id);

            estrellas = `
                <div class="estrellas-puntuacion">
                    ${estrellasPuntuacion}
                </div>`;
        }
        else
        {
            let nivelEstrellas = util.nivelEstrellas(reserva.puntos);
            estrellas = `
                <div class="estrellas">
                    <span style="background-position:-${nivelEstrellas}px"></span>
                </div>`;
        }

        return `
            <div class="ficha-local">
                <div class="imagen">
                    <img src="${imagen}" />
                </div>
                <div class="detalles">
                    <h3 class="titulo">${local.nombre}</h3>
                    <span class="tipo">${tipo}</span>
                    <span class="cupos">Cupos: ${reserva.cupos}</span>
                    ${estrellas}
                </div>
            </div>
        `;
    },

    crearBotonesEstrellasPuntaje(idLocal, idReserva)
    {
        let html = "";

        for(let i=1; i<=5; i++)
        {
            html += `
                <input
                    value=""
                    type="button"
                    class="boton-estrellas-puntuacion boton-estrellas-vacio"
                    data-id-local="${idLocal}"
                    data-id-reserva="${idReserva}"
                    data-puntos="${i}"
                >
                `;
        }
        return html;
    },

    puntuarReserva()
    {
        let idLocal   = parseInt(this.dataset.idLocal);
        let idReserva = parseInt(this.dataset.idReserva);
        let puntos    = parseInt(this.dataset.puntos);

        reservas.puntuar(idLocal, idReserva, puntos);

        const divDetalles = this.closest("div").parentNode;
        const nuevoDiv = document.createElement("div");
        const nuevoSpan = document.createElement("span");

        nuevoDiv.setAttribute('class', 'estrellas');

        const nivelEstrellas = util.nivelEstrellas(puntos);
        nuevoSpan.setAttribute('style', `background-position:-${nivelEstrellas}px`);

        nuevoDiv.appendChild(nuevoSpan);
        divDetalles.appendChild(nuevoDiv);

        this.parentNode.style.display = 'none';
    },

    mouseSobreBotonEstrella()
    {
        let div = this.closest("div");
        let botones = Array.from(div.children);

        for(let i=0; i < 5; i++)
        {
            botones[i].classList.remove('completa');
        }

        for(let i=0; i < this.dataset.puntos; i++)
        {
            botones[i].classList.add('completa');
        }
    },

    mouseSaleDeBotonEstrella()
    {
        let botones = Array.from(this.children);

        for(let i=0; i < 5; i++)
        {
            botones[i].classList.remove('completa');
        }
    },

}