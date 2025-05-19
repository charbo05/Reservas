"use strict";

// ---------------------------------------------------------------------------------------------------------------
//
//  CLASE LOCALES
//

class Local {

    id         = null;
    nombre     = null;
    tipo       = null; // restaurante, museo, teatro
    cupoMaximo = null;
    foto       = null;
    direccion  = null;

    reservasHabilitadas = true;

    reservas = [];

    constructor(nombre, tipo, cupoMaximo, reservasHabilitadas, foto, direccion)
    {
        this.id = util.generarId();
        this.nombre = nombre;
        this.tipo = tipo;
        this.cupoMaximo = cupoMaximo;
        this.reservasHabilitadas = reservasHabilitadas;
        this.foto = foto;
        this.direccion = direccion;
    }

    promedioCalificaciones()
    {
        let cantidadReservas = this.reservas.length;
        let cantidadFinalizadas = 0;
        let puntos = 0;

        if(cantidadReservas == 0)
        {
            return 0;
        }

        for(let i=0; i < cantidadReservas; i++)
        {
            let reserva = this.reservas[i];

            if(reserva.estado === 'finalizada' && reserva.puntos > 0)
            {
                puntos += reserva.puntos;
                cantidadFinalizadas++;
            }
        }

        if(cantidadFinalizadas === 0)
        {
            return 0;
        }

        return puntos / cantidadFinalizadas;
    }

    porcentajeOcupacion()
    {
        let cantidadReservas = this.reservas.length;
        let sumaCupos = 0;

        for(let i=0; i < cantidadReservas; i++)
        {
            let reserva = this.reservas[i];

            if(reserva.estado === 'pendiente')
            {
                sumaCupos += reserva.cupos;
            }
        }

        return sumaCupos * 100 / this.cupoMaximo;
    }

    obtenerReservaPorId(id)
    {
        let cantidadReservas = this.reservas.length;

        for(let i=0; i < cantidadReservas; i++)
        {
            let reserva = this.reservas[i];

            if(reserva.id === id)
            {
                return reserva;
            }
        }
        return null;
    }

    obtenerReservaPendienteDelUsuario(usuario)
    {
        let cantidadReservas = this.reservas.length;

        for(let i=0; i < cantidadReservas; i++)
        {
            let reserva = this.reservas[i];

            if(usuario === reserva.usuario && reserva.estado === 'pendiente')
            {
                return reserva;
            }
        }
        return null;
    }

    obtenerReservasFinalizadasDelUsuario(usuario)
    {
        let cantidadReservas = this.reservas.length;
        let reservas = [];

        for(let i=0; i < cantidadReservas; i++)
        {
            let reserva = this.reservas[i];

            if(usuario === reserva.usuario && reserva.estado === 'finalizada')
            {
                reservas.push(reserva);
            }
        }
        return reservas;
    }

    obtenerTodasLasReservasDelUsuario(usuario)
    {
        let cantidadReservas = this.reservas.length;
        let reservas = [];

        for(let i=0; i < cantidadReservas; i++)
        {
            let reserva = this.reservas[i];

            if(usuario === reserva.usuario)
            {
                reservas.push(reserva);
            }
        }
        return reservas;
    }

    obtenerReservasPendientes()
    {
        let cantidadReservas = this.reservas.length;
        let pendientes = [];

        for(let i=0; i < cantidadReservas; i++)
        {
            let reserva = this.reservas[i];

            if(reserva.estado === 'pendiente')
            {
                pendientes.push(reserva);
            }
        }
        return pendientes;
    }

    cuposLibres()
    {
        let cantidadReservas = this.reservas.length;
        let libres = this.cupoMaximo;

        for(let i=0; i < cantidadReservas; i++)
        {
            let reserva = this.reservas[i];

            if(reserva.estado === 'pendiente')
            {
                libres -= reserva.cupos;
            }
        }
        return libres;
    }

    cuposOcupados()
    {
        return this.cupoMaximo - this.cuposLibres();
    }

    totalesReservas()
    {
        let cantidadReservas = this.reservas.length;

        let totales = { pendientes: 0, finalizadas: 0, canceladas: 0, total: 0 }

        for(let i=0; i < cantidadReservas; i++)
        {
            let reserva = this.reservas[i];

            if(reserva.estado === 'pendiente')
                totales.pendientes++;
            else
            if(reserva.estado === 'finalizada')
                totales.finalizadas++;
            else
            if(reserva.estado === 'cancelada')
                totales.canceladas++;
        }

        totales.total = cantidadReservas;

        return totales;
    }

    // -----------------------------------------------------------------------------------------------------------
    // Agrega una reserva (debe ser un objeto Reserva)

    agregarReserva(reserva)
    {
        // Si las reservas NO están habilitadas para éste local
        if(!this.reservasHabilitadas)
        {
            // Se retorna con mensaje de error
            mensajero.mostrarError('De momento no es posible relizar reservas para éste local');
            return false;
        }

        // Por cada reserva existente
        for(let i=0; i < this.reservas.length; i++)
        {
            // Tomo la reserva en la posición i de la lista
            let existente = this.reservas[i];

            // Si el usuario tiene reserva pendiente
            if( existente.usuario === reserva.usuario  // Si el usuario ya tiene una reserva
             && existente.estado  === 'pendiente'      // y la reserva tiene estado pendiente
            )
            {
                // Se retorna con mensaje de error
                mensajero.mostrarError('Ya tiene una reserva pendiente en el local','Reserva existente');
                return false;
            }
        }

        // Cupos libres en el local
        let libres = this.cuposLibres();

        // Si los cupos libres son menores a los solicitados en la reserva
        if(libres < reserva.cupos)
        {
            // Se retorna con mensaje de error
            mensajero.mostrarError(`El local cuenta solamente con ${libres} cupos libres`,'Sin capacidad');
            return false;
        }

        // Si se llega a este punto se agrega la reserva
        this.reservas.push(reserva);

        // Si se completa el cupo máximo
        if(this.cuposOcupados() === this.cupoMaximo)
        {
            // Se inhabilita la reserva
            this.reservasHabilitadas = false;
        }

        // Se retorna verdadero (se pudo agregar la reserva)
        return true;
    }
}

// ------------------------------------------------------------------------------------------------------------------
//
//  GESTOR DE LOCALES (OBJETO)
//

const locales = {

    // -----------------------------------------------------------------------------------------------------------
    // Listado de locales

    listaLocales: [],

    // -----------------------------------------------------------------------------------------------------------
    // Agrega un local a listaLocales (debe ser un objeto Local)

    agregar(local)
    {
        locales.listaLocales.push(local);
    },

    // -----------------------------------------------------------------------------------------------------------
    // Obtiene un local por id (de local)

    obtenerLocalPorId(id)
    {
        let _this = locales;

        for(let i=0; i < _this.listaLocales.length; i++)
        {
            let local = _this.listaLocales[i];

            if(local.id === id)
            {
                return local;
            }
        }
        return null;
    },

    // -----------------------------------------------------------------------------------------------------------
    // Guarda la configuración de reservas (Cupo máximo de reservas que admite el local y reservas habilitadas si o no)

    guardarConfiguracion()
    {
        let idLocal     = this.dataset.idLocal;
        let campoCupo   = util.obtenerPorId('cupo-maximo');
        let habilitada  = util.obtenerPorId('reservas-habilitadas');
        let cupo        = campoCupo.value;

        idLocal = parseInt(idLocal);

        let local = locales.obtenerLocalPorId(idLocal);

        if(!local)
        {
            mensajero.mostrarError('No se pudo identificar el local');
            return;
        }

        if(!util.esEnteroPositivo(cupo) || cupo < 1)
        {
            mensajero.mostrarError('El valor de cupo no es válido');
            return;
        }

        if(!util.esBooleano(habilitada.checked))
        {
            mensajero.mostrarError('El valor de habilitar reserva no es válido');
            return;
        }

        if(local.cuposOcupados() > 0)
        {
            mensajero.mostrarError('Solo puede guardar cambios cuando no existan reservas pendientes');
            return;
        }

        cupo = parseInt(cupo);

        local.reservasHabilitadas = habilitada.checked;
        local.cupoMaximo = cupo;

        mensajero.mostrarExito('Se guardaron los datos correctamente');
        sitio.mostrarPaginaLocales();
    },
}
