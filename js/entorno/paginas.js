"use strict";

// ------------------------------------------------------------------------------------------------------------------
//
//  CLASE PAGINA
//
//  - Le llamamos "página" a un div que agrupa elementos en común correspondientes a una funcionalidad determinada
//

class Pagina
{
    id      = null;  // Id del div que agrupa el contenido
    visible = false; // Si la página se debe ver o no

    constructor(id, visible)
    {
        this.id = id;
        this.visible = visible
    }

    // Oculta la página
    ocultar()
    {
        this.visible = false;
        document.getElementById(this.id).style.display = "none";
    }

    // Mustra la página
    mostrar()
    {
        this.visible = true;
        document.getElementById(this.id).style.display = "block";
    }
}

// ------------------------------------------------------------------------------------------------------------------
//
//  GESTOR DE PAGINAS (OBJETO)
//
//  - Maneja un listado de páginas (Objetos Pagina) y métodos relacionados a las mismas
//

const paginas = {

    // Listado de páginas (Objetos Pagina)
    lista: [],

    filtroTipoLocal: 'Todos',

    idTiempo:0,

    // Agrega una página a la lista (debe ser un objeto Pagina)
    agregar(pagina)
    {
        this.lista.push(pagina);
    },

    // Muestra la página con el id que se le indique
    mostrar(id)
    {
        for(let i = 0; i < this.lista.length; i++)
        {
            let pagina = this.lista[i];

            if(pagina.id === id)
            {
               this.oculatarTodas();
               pagina.mostrar();
            }
        }
        setTimeout(function(){
            window.scrollTo(0, 0);
        }, 50);
    },

    // Oculta todas las páginas
    oculatarTodas()
    {
        for(let i = 0; i < this.lista.length; i++)
        {
            this.lista[i].ocultar();
        }
    },

    mostrarAclaracionClave()
    {
        this.removeAttribute('readonly');
        document.getElementById('aclaracion-formato-clave').style.display = '';
    },

    ocultarAclaracionClave()
    {
        document.getElementById('aclaracion-formato-clave').style.display = 'none';
        this.setAttribute('readonly','readonly');
    },

    establecerComoSoloLectura()
    {
      this.setAttribute('readonly','readonly');
    },

    actualizarEnlaces()
    {
        // Referencia al elemento (span) que contiene el enlace (a) para iniciar o cerrar sesión
        let enlacesPanel = util.obtenerPorId('sesion-iniciar-cerrar');
        let usuarioPanel = util.obtenerPorId('sesion-nombre-entidad');

        let enlacesMenu = util.obtenerPorSelector('#menu div');


        // Si NO se inició sesión
        if(sesion.iniciada === false)
        {
            // Se cambia en link de "Cerrar Sesion" a "Iniciar Sesión"
            enlacesPanel.innerHTML = '<a href="javascript:sitio.mostrarPaginaIniciarSesion()">Iniciar Sesión</a>';
            usuarioPanel.innerHTML = '';
            enlacesMenu.innerHTML = '';
        }

        // Si se inició sesión
        if(sesion.iniciada)
        {
            // Se cambia en link de "Iniciar Sesión" a "Cerrar Sesion"
            enlacesPanel.innerHTML = '<a href="javascript:usuarios.cerrarSesion()">Cerrar Sesión</a>';
            usuarioPanel.innerHTML = sesion.usuario.entidad.nombre + '&nbsp ';

            if(sesion.usuario.esLocal())
            {
                enlacesMenu.innerHTML = `
                    <ul>

                        <li>
                            <a href="javascript:sitio.mostrarPaginaLocales()">Administración del Local</a>
                        </li>

                        <li class="iconos">
                            <a class="inicio" href="javascript:sitio.mostrarPaginaPricipal()"></a>
                            <a class="subir"  href="javascript:scroll(0,0);"></a>
                        </li>

                    </ul>`;
            }

            if(sesion.usuario.esPersona())
            {
                enlacesMenu.innerHTML = `
                    <ul>

                        <li>
                            <a href="javascript:sitio.mostrarPaginaReservasFinalizadas()">Reservas finalizadas</a>
                        </li>

                        <li>
                            <a href="javascript:sitio.mostrarPaginaReservasRealizadas()">Reservas realizadas</a>
                        </li>

                        <li>
                            <a href="javascript:sitio.mostrarPaginaReservasPendientes()">Reservas pendientes</a>
                        </li>

                        <li class="iconos">
                            <a class="inicio" href="javascript:sitio.mostrarPaginaPricipal()"></a>
                            <a class="subir"  href="javascript:scroll(0,0);"></a>
                        </li>

                    </ul>`;
            }

        }

    },

    animarCambioFondo(fondos)
    {
      let opacidadSalida = 0;
      let opacidadEntrada = 1;

      if(paginas.idTiempo > 1)
        return;

      paginas.idTiempo = setInterval(function()
      {
        opacidadSalida += 0.05;

        if(opacidadSalida < 1)
        {
          util.obtenerPorSelector('body').style.backgroundColor = `rgba(255, 255, 255, ${opacidadSalida})`;
        }
        else
        {
          clearInterval(paginas.idTiempo);

          util.obtenerPorSelector('html').classList.add(fondos.agregar);

          fondos.quitar.forEach(function(fondo){
            util.obtenerPorSelector('html').classList.remove(fondo);
          });

          paginas.idTiempo = setInterval(function()
          {
            opacidadEntrada -= 0.05;

            if(opacidadEntrada > 0)
            {
              util.obtenerPorSelector('body').style.backgroundColor = `rgba(255, 255, 255, ${opacidadEntrada})`;
            }
            else
            {
              clearInterval(paginas.idTiempo);
              paginas.idTiempo = 0;
            }
          }, 70);
        }
      }, 25);
    },

    actualizarFiltroBusqueda()
    {
      let divPadre = this.closest("div");
      let botones = Array.from(divPadre.children);
      let clase = 'filtro-aplicado';

      let fondos = {
        agregar: null,
        quitar: [],
      }

      for(let i = 0; i < botones.length; i++)
      {
        let boton = botones[i];

        if(boton === this) // this es el botón que se apretó
        {
            boton.classList.add(clase);
            paginas.filtroTipoLocal = boton.value;
            fondos.agregar = boton.value;
        }
        else
        {
            boton.classList.remove(clase);
            fondos.quitar.push(boton.value);
        }
      }
      paginas.animarCambioFondo(fondos);
    },

    limpiar()
    {
      paginas.limpiarFiltros();
      paginas.limpiarCamposBusqueda();
      paginas.limpiarFormulariosUsuario();
    },

    limpiarFiltros()
    {
      paginas.filtroTipoLocal = 'Todos';

      util.obtenerTodosPorSelector('.filtro-busqueda').forEach(function(divFiltro){

        let botones = Array.from(divFiltro.children);
        let clase = 'filtro-aplicado';

        for(let i = 0; i < botones.length; i++)
        {
          let boton = botones[i];

          if(boton.value != 'Todos')
              boton.classList.remove(clase);
          else
              boton.classList.add(clase);
        }

      });
    },

    limpiarCamposBusqueda()
    {
      util.obtenerTodosPorSelector('.campo-busqueda').forEach(function(campoBusqueda){

        campoBusqueda.value = '';

      });
    },

    limpiarFormulariosUsuario()
    {
        util.obtenerTodosPorSelector('#inicio-sesion input').forEach(
          function(input){
            if(input.getAttribute('type') != 'button')
              input.value = '';
          }
        );

        util.obtenerTodosPorSelector('#registro-usuario input').forEach(
          function(input){
            if(input.getAttribute('type') != 'button')
              input.value = '';
          }
        );

        util.obtenerPorId('aclaracion-formato-clave').style.display = 'none';
    },

    inicioSesionConEnter(evento)
    {
      if (evento.key === "Enter")
      {
        evento.preventDefault();
        util.obtenerPorId('boton-inicio-sesion').click();
      }
    },
}
