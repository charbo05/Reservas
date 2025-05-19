"use strict";

const sitio = {

    //------------------------------------------------------------------------------------------------------------
    // CUANDO SE CARGA EL SITIO

    alCargarSitio()
    {
        // Carga de datos inicial
        sitio.cargaInicial();

        // Se ejecutan los addEventListener de los botones y demás
        sitio.registrarEventos();

        // Se muestra la página principal
        sitio.mostrarPaginaPricipal();
    },

    //------------------------------------------------------------------------------------------------------------
    // PAGINAS (DIVs)

    mostrarPaginaPricipal()
    {
        paginas.limpiar();
        htmlPaginaPrincipal.insertarHtml();
        paginas.mostrar('principal');
    },

    mostrarPaginaIniciarSesion()
    {
        paginas.limpiar();
        paginas.mostrar('inicio-sesion');
        util.obtenerPorId('usuario-inicio-sesion').focus();
    },

    mostrarPaginaRegistroUsuario()
    {
        paginas.limpiar();
        paginas.mostrar('registro-usuario');
    },

    mostrarPaginaLocales()
    {
        paginas.limpiar();
        htmlPaginaLocales.insertarHtml();
        paginas.mostrar('locales');
    },

    mostrarPaginaReservasPendientes()
    {
        paginas.limpiar();
        htmlPaginaReservasPendientes.insertarHtml();
        paginas.mostrar('personas-reservas-pendientes');
    },

    mostrarPaginaReservasRealizadas()
    {
        paginas.limpiar();
        htmlPaginaReservasRealizadas.insertarHtml();
        paginas.mostrar('personas-reservas-realizadas');
    },

    mostrarPaginaReservasFinalizadas()
    {
        paginas.limpiar();
        htmlPaginaReservasFinalizadas.insertarHtml();
        paginas.mostrar('personas-reservas-finalizadas');
    },

    //------------------------------------------------------------------------------------------------------------
    // REGISTRO DE EVENTOS PARA ELEMENTOS ESTATICOS (HTML NO GENERADO DESPUES DE LA CARGA DEL SITIO)

    registrarEventos()
    {
        // Ir a la página principal (inicio) al click en título del sitio
        util.registrarEventosSelector('#cabecera h1', 'click', sitio.mostrarPaginaPricipal);

        // Inicio de sesión
        util.registrarEventosSelector('#boton-inicio-sesion', 'click', usuarios.iniciarSesion);

        // Registro de usuario
        util.registrarEventosSelector('#boton-registro', 'click', usuarios.registrar);

        // Mensaje de aclaración referente a formato de clave requerido (1 mayúscula, 1 minúscula...)
        util.registrarEventosSelector('#clave-registro', 'focus', paginas.mostrarAclaracionClave);
        util.registrarEventosSelector('#clave-repetir-registro', 'focus', paginas.mostrarAclaracionClave);

        // Inicio de sesión al presionar la tecla enter en el formulario del ingreso
        util.registrarEventosSelector('#clave-inicio-sesion', 'keyup', paginas.inicioSesionConEnter);

        // Truco que evita la aparición de la contraseña sugerida del navegador
        util.registrarEventosSelector('#clave-registro', 'focusout', paginas.establecerComoSoloLectura);
        util.registrarEventosSelector('#clave-repetir-registro', 'focusout', paginas.establecerComoSoloLectura);
    },

    //------------------------------------------------------------------------------------------------------------
    // DATOS PRECARGADOS

    cargaInicial()
    {
        // Se agregan las páginas
        paginas.agregar(new Pagina('principal', true)); // Inicia visible (true)
        paginas.agregar(new Pagina('inicio-sesion', false));
        paginas.agregar(new Pagina('registro-usuario', false));
        paginas.agregar(new Pagina('locales', false));
        paginas.agregar(new Pagina('personas-reservas-pendientes', false));
        paginas.agregar(new Pagina('personas-reservas-realizadas', false));
        paginas.agregar(new Pagina('personas-reservas-finalizadas', false));

        //------------------------------------------------------------------------------------------------------------
        // Se crean los usuarios de tipo Local

        // Restaurantes
        usuarios.agregarLocal(
            new Usuario(
              "fogon",
              "123456",
              "local",
              new Local("El Fogón", "restaurante", 30, true, "restaurante1.png", "San José 1234, Montevideo")
            )
        );
        usuarios.agregarLocal(
            new Usuario(
                "fuegos",
                "123456",
                "local",
                new Local("Tres Fuegos", "restaurante", 40, true, "restaurante2.png", "Durazno 1234, Montevideo")
            )
        );
        usuarios.agregarLocal(
            new Usuario(
                "aguila",
                "123456",
                "local",
                new Local("Rincón del Águila", "restaurante", 50, true, "restaurante3.png", "Maldonado 1234, Montevideo" )
            )
        );

        // Museos
        usuarios.agregarLocal(
            new Usuario(
                "historico",
                "123456",
                "local",
                new Local("Museo Histórico Nacional", "museo", 30, true, "museo1.png", "Canelones 1234, Montevideo")
            )
        );
        usuarios.agregarLocal(
            new Usuario(
                "roca",
                "123456",
                "local",
                new Local("Museo Roca", "museo", 40, true, "museo2.png", "Soriano 1234, Montevideo")
            )
        );
        usuarios.agregarLocal(
            new Usuario(
                "maritimo",
                "123456",
                "local",
                new Local("Museo Marítimo", "museo", 50, true, "museo3.png", "Colonia 1234, Montevideo")
            )
        );

        // Teatros
        usuarios.agregarLocal(
            new Usuario(
                "metropolitan",
                "123456",
                "local",
                new Local("Teatro Metropolitan", "teatro", 30, true, "teatro1.png", "Mercedes 1234, Montevideo")
            )
        );
        usuarios.agregarLocal(
            new Usuario(
                "coliseo",
                "123456",
                "local",
                new Local("Teatro Coliseo", "teatro", 40, true, "teatro2.png", "Paysandú 1234, Montevideo")
            )
        );
        usuarios.agregarLocal(
            new Usuario(
                "maipo",
                "123456",
                "local",
                new Local("Teatro Maipo", "teatro", 50, true, "teatro3.png", "Cerro Largo 1234, Montevideo")
            )
        );

        //------------------------------------------------------------------------------------------------------------
        // Se crean los usuarios de tipo Persona

        usuarios.agregarPersona(new Usuario('julio','123456','persona', new Persona('Julio','Viana')));
        usuarios.agregarPersona(new Usuario('maxi', '123456','persona', new Persona('Maximiliano','Charbonnier')));
        usuarios.agregarPersona(new Usuario('noe','123456','persona', new Persona('Noelia','Rodríguez')));

        usuarios.agregarPersona(new Usuario('gabi','123456','persona', new Persona('Gabriela','Montes')));
        usuarios.agregarPersona(new Usuario('daniel', '123456','persona', new Persona('Daniel','Suárez')));

        usuarios.agregarPersona(new Usuario('alejandro', '123456','persona', new Persona('Alejandro','Pérez')));
        usuarios.agregarPersona(new Usuario('susana', '123456','persona', new Persona('Susana','Duarte')));

        usuarios.agregarPersona(new Usuario('luis', '123456','persona', new Persona('Luis','González')));

        //------------------------------------------------------------------------------------------------------------
        // Se crean instancias pre-cargadas de reservas soliciatadas en la letra del Obligatorio

        // Reservas pendientes

        // Usuario 1 (julio)
        locales.listaLocales[0].reservas[0] = new Reserva(usuarios.listaPersonas[0], 2, 'pendiente', 0);
        locales.listaLocales[2].reservas[0] = new Reserva(usuarios.listaPersonas[0], 4, 'pendiente', 0);
        locales.listaLocales[4].reservas[0] = new Reserva(usuarios.listaPersonas[0], 6, 'pendiente', 0);
        // Usuario 2 (maxi)
        locales.listaLocales[1].reservas[0] = new Reserva(usuarios.listaPersonas[1], 4, 'pendiente', 0);
        locales.listaLocales[3].reservas[0] = new Reserva(usuarios.listaPersonas[1], 6, 'pendiente', 0);
        locales.listaLocales[5].reservas[0] = new Reserva(usuarios.listaPersonas[1], 8, 'pendiente', 0);
        // Usuario 3 (noe)
        locales.listaLocales[0].reservas[1] = new Reserva(usuarios.listaPersonas[2], 3, 'pendiente', 0);
        locales.listaLocales[1].reservas[1] = new Reserva(usuarios.listaPersonas[2], 5, 'pendiente', 0);
        locales.listaLocales[2].reservas[1] = new Reserva(usuarios.listaPersonas[2], 7, 'pendiente', 0);

        // Reservas finalizadas y pendientes

        // Usuario 4 (gabi)
        locales.listaLocales[0].reservas[2] = new Reserva(usuarios.listaPersonas[3], 4, 'finalizada', 4);
        locales.listaLocales[1].reservas[2] = new Reserva(usuarios.listaPersonas[3], 4, 'finalizada', 0);
        locales.listaLocales[0].reservas[3] = new Reserva(usuarios.listaPersonas[3], 2, 'pendiente', 0);
        locales.listaLocales[3].reservas[1] = new Reserva(usuarios.listaPersonas[3], 2, 'pendiente', 0);
        // Usuario 5 (daniel)
        locales.listaLocales[1].reservas[3] = new Reserva(usuarios.listaPersonas[4], 4, 'finalizada', 3);
        locales.listaLocales[2].reservas[2] = new Reserva(usuarios.listaPersonas[4], 4, 'finalizada', 0);
        locales.listaLocales[1].reservas[4] = new Reserva(usuarios.listaPersonas[4], 2, 'pendiente', 0);
        locales.listaLocales[3].reservas[2] = new Reserva(usuarios.listaPersonas[4], 2, 'pendiente', 0);

        // Reservas en todos los estados para todos los locales

        // Usuario 7 (luis)
        locales.listaLocales[0].reservas[4] = new Reserva(usuarios.listaPersonas[7], 4, 'finalizada', 3);
        locales.listaLocales[0].reservas[5] = new Reserva(usuarios.listaPersonas[7], 4, 'finalizada', 3);
        locales.listaLocales[0].reservas[6] = new Reserva(usuarios.listaPersonas[7], 4, 'cancelada', 0);
        locales.listaLocales[0].reservas[7] = new Reserva(usuarios.listaPersonas[7], 2, 'pendiente', 0);

        locales.listaLocales[1].reservas[5] = new Reserva(usuarios.listaPersonas[7], 4, 'finalizada', 4);
        locales.listaLocales[1].reservas[6] = new Reserva(usuarios.listaPersonas[7], 4, 'cancelada', 0);
        locales.listaLocales[1].reservas[7] = new Reserva(usuarios.listaPersonas[7], 2, 'pendiente', 0);

        locales.listaLocales[2].reservas[3] = new Reserva(usuarios.listaPersonas[7], 4, 'finalizada', 5);
        locales.listaLocales[2].reservas[4] = new Reserva(usuarios.listaPersonas[7], 4, 'cancelada', 0);
        locales.listaLocales[2].reservas[5] = new Reserva(usuarios.listaPersonas[7], 2, 'pendiente', 0);

        locales.listaLocales[3].reservas[3] = new Reserva(usuarios.listaPersonas[7], 4, 'finalizada', 2);
        locales.listaLocales[3].reservas[4] = new Reserva(usuarios.listaPersonas[7], 4, 'cancelada', 0);
        locales.listaLocales[3].reservas[5] = new Reserva(usuarios.listaPersonas[7], 2, 'pendiente', 0);

        locales.listaLocales[4].reservas[1] = new Reserva(usuarios.listaPersonas[7], 4, 'finalizada', 4);
        locales.listaLocales[4].reservas[2] = new Reserva(usuarios.listaPersonas[7], 4, 'cancelada', 0);
        locales.listaLocales[4].reservas[3] = new Reserva(usuarios.listaPersonas[7], 2, 'pendiente', 0);

        locales.listaLocales[5].reservas[1] = new Reserva(usuarios.listaPersonas[7], 4, 'finalizada', 5);
        locales.listaLocales[5].reservas[2] = new Reserva(usuarios.listaPersonas[7], 4, 'cancelada', 0);
        locales.listaLocales[5].reservas[3] = new Reserva(usuarios.listaPersonas[7], 2, 'pendiente', 0);

        locales.listaLocales[6].reservas[0] = new Reserva(usuarios.listaPersonas[7], 4, 'finalizada', 3);
        locales.listaLocales[6].reservas[1] = new Reserva(usuarios.listaPersonas[7], 4, 'cancelada', 0);
        locales.listaLocales[6].reservas[2] = new Reserva(usuarios.listaPersonas[7], 2, 'pendiente', 0);

        locales.listaLocales[7].reservas[0] = new Reserva(usuarios.listaPersonas[7], 4, 'finalizada', 4);
        locales.listaLocales[7].reservas[1] = new Reserva(usuarios.listaPersonas[7], 4, 'cancelada', 0);
        locales.listaLocales[7].reservas[2] = new Reserva(usuarios.listaPersonas[7], 2, 'pendiente', 0);

        locales.listaLocales[8].reservas[0] = new Reserva(usuarios.listaPersonas[7], 4, 'finalizada', 5);
        locales.listaLocales[8].reservas[1] = new Reserva(usuarios.listaPersonas[7], 4, 'cancelada', 0);
        locales.listaLocales[8].reservas[2] = new Reserva(usuarios.listaPersonas[7], 2, 'pendiente', 0);

        // Otras finalizadas
        locales.listaLocales[0].reservas[8] = new Reserva(usuarios.listaPersonas[0], 2, 'finalizada', 0); // julio
        locales.listaLocales[8].reservas[3] = new Reserva(usuarios.listaPersonas[0], 2, 'finalizada', 4); // julio
        locales.listaLocales[2].reservas[6] = new Reserva(usuarios.listaPersonas[1], 4, 'finalizada', 0); // maxi
        locales.listaLocales[8].reservas[4] = new Reserva(usuarios.listaPersonas[1], 4, 'finalizada', 4); // maxi
        locales.listaLocales[4].reservas[4] = new Reserva(usuarios.listaPersonas[2], 6, 'finalizada', 0); // noe
        locales.listaLocales[8].reservas[5] = new Reserva(usuarios.listaPersonas[2], 6, 'finalizada', 4); // noe
    },

}

sitio.alCargarSitio(); // Lo primero que corre al cargar el sitio (punto de entrada)
