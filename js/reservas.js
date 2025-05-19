"use strict";

// ---------------------------------------------------------------------------------------------------------------
//
//  CLASE RESERVAS
//

class Reserva
{
    id      = null;
    usuario = null; // Objeto de tipo usuario (solo personas)
    cupos   = null; // Cantidad de cupos que se reservan
    estado  = null; // Estado: pendiente, finalizada o cancelada
    puntos  = null; // Puntuación indicada por el usuario (del 1 al 5)

    constructor(usuario, cupos, estado, puntos)
    {
        this.id      = util.generarId();
        this.usuario = usuario;
        this.cupos   = parseInt(cupos);
        this.estado  = estado;
        this.puntos  = parseInt(puntos);
    }
}

// ---------------------------------------------------------------------------------------------------------------
//
//  GESTOR DE RESERVAS (OBJETO)
//

const reservas = {

    // -----------------------------------------------------------------------------------------------------------
    // Realizar reserva - Se ejecuta al presionar un botón de "Reservar" en una lista de locales

    reservar()
    {
        let idLocal = parseInt(this.dataset.idLocal);
        let local = locales.obtenerLocalPorId(idLocal);

        if(local === null)
        {
            mensajero.mostrarError('No se encontraron datos del Local', 'Error');
            return;
        }

        let cupos = util.obtenerPorId('cupos_'+idLocal);

        if(!cupos || isNaN(cupos.value) || cupos.value < 1)
        {
            mensajero.mostrarError('No se definió la cantidad de personas');
            return;
        }

        cupos = cupos.value;

        let reserva = new Reserva(sesion.usuario, cupos, 'pendiente', 0);

        if(local.agregarReserva(reserva))
        {
            let s = reserva.cupos > 1 ? 's' : '';
            mensajero.mostrarExito(`Se agregó una reserva para ${cupos} persona${s}`, `${local.nombre}`);
            htmlPaginaPrincipal.insertarHtml();
        }
    },

    // -----------------------------------------------------------------------------------------------------------
    // Cancelar reserva - Se ejecuta al presionar un botón de "Cancelar reserva" en una lista de locales

    cancelar()
    {
        let idLocal = parseInt(this.dataset.idLocal);
        let local = locales.obtenerLocalPorId(idLocal);

        if(local === null)
        {
            mensajero.mostrarError('No se encontraron datos del Local');
            return;
        }

        let reserva = local.obtenerReservaPendienteDelUsuario(sesion.usuario);

        if(reserva === null)
        {
            mensajero.mostrarError('No se encontró la reserva a cancelar');
            return;
        }

        reserva.estado = 'cancelada';

        let s = reserva.cupos > 1 ? 's' : '';
        mensajero.mostrarExito(`Se canceló una reserva para ${reserva.cupos} persona${s}`, `${local.nombre}`);

        htmlPaginaPrincipal.insertarHtml();
    },

    // -----------------------------------------------------------------------------------------------------------
    // Finalizar reserva - Se ejecuta al presionar un botón de "Finalizar reserva" en la página de "Administración
    // del Local" sección "Gestión de reservas pendientes"

    finalizar()
    {
        let idLocal   = parseInt(this.dataset.idLocal);
        let idReserva = parseInt(this.dataset.idReserva);

        let local = locales.obtenerLocalPorId(idLocal);

        if(local === null)
        {
            mensajero.mostrarError('No se encontraron datos del Local');
            return;
        }

        let reservas = local.obtenerReservasPendientes();

        for(let i=0; i < reservas.length; i++)
        {
            if(reservas[i].id === idReserva)
            {
                reservas[i].estado = 'finalizada';
            }
        }

        mensajero.mostrarExito(`Reserva finalizada`);

        htmlPaginaLocales.insertarHtml();
    },

    // -----------------------------------------------------------------------------------------------------------
    // Puntuar reserva

    puntuar(idLocal, idReserva, puntos)
    {
        let local   = locales.obtenerLocalPorId(idLocal);
        let reserva = local.obtenerReservaPorId(idReserva);

        reserva.puntos = puntos;
    }

}