"use strict";

// ---------------------------------------------------------------------------------------------------------------
//
//  CLASE USUARIO
//

class Usuario
{
    id      = null;
    nombre  = null;
    clave   = null;
    tipo    = null; // string "persona" o "local"
    entidad = null; // persona o local (objeto)

    constructor(nombre, clave, tipo, entidad)
    {
        this.id      = util.generarId();
        this.nombre  = nombre;
        this.clave   = clave;
        this.tipo    = tipo;
        this.entidad = entidad;
    }

    esPersona()
    {
        return this.tipo === 'persona';
    }

    esLocal()
    {
        return this.tipo === 'local';
    }
}

// ---------------------------------------------------------------------------------------------------------------
//
//  GESTOR DE USUARIOS (OBJETO)
//

const usuarios = {

    // -----------------------------------------------------------------------------------------------------------
    // Listados de usuarios

    listaLocales:  [],
    listaPersonas: [],

    // -----------------------------------------------------------------------------------------------------------
    // Agrega un usuario persona a listaPersonas (debe ser un objeto Usuario)

    agregarPersona(usuario)
    {
        usuarios.listaPersonas.push(usuario);
        personas.agregar(usuario.entidad);
    },

    // -----------------------------------------------------------------------------------------------------------
    // Agrega un usuario local a listaLocales (debe ser un objeto Usuario)

    agregarLocal(usuario)
    {
        usuarios.listaLocales.push(usuario);
        locales.agregar(usuario.entidad);
    },

    // -----------------------------------------------------------------------------------------------------------
    // Inicio de sesión del usuario (persona o local)

    iniciarSesion()
    {
        let campoUsuario  = document.querySelector('#usuario-inicio-sesion');
        let campoClave    = document.querySelector('#clave-inicio-sesion');

        let nombreUsuario = campoUsuario.value;
        let clave         = campoClave.value;

        // Si hay una sesión abierta se muestra error
        if(sesion.iniciada === true)
        {
            mensajero.mostrarError('La sesión ya se encuentra iniciada');
        }
        else // Si la sesion está cerrada se puede abrir
        {
            if(usuarios.esValido(nombreUsuario, clave))
            {
                // Se guarda en sesión el usuario (objeto) y se establece la sesión como iniciada
                sesion.usuario  = usuarios.obtenerUsuarioPorNombre(nombreUsuario);
                sesion.iniciada = true;

                paginas.actualizarEnlaces();

                if(sesion.usuario.esPersona())
                    sitio.mostrarPaginaPricipal();
                else
                if(sesion.usuario.esLocal())
                    sitio.mostrarPaginaLocales();

                campoUsuario.value = '';
                campoClave.value = '';

                mensajero.mostrarExito('El inicio de sesión fue exitoso', `¡Bienvenido ${sesion.usuario.entidad.nombre}!`);
            }
            else // Si el usuario no es válido (no coicide usuario y contraseña)
            {
                mensajero.mostrarError('Usuario o contraseña incorrectos');
            }
        }
    },

    // -----------------------------------------------------------------------------------------------------------
    // Cierre de sesión del usuario

    cerrarSesion()
    {
        // Si no hay una sesión abierta se muestra error
        if(sesion.iniciada === false)
        {
            mensajero.mostrarError('La sesión no se encuentra iniciada');
        }
        else // Si la sesión está abierta se cierra
        {
            let nombreEntidad = sesion.usuario.entidad.nombre;

            // Se borran los datos de sesión
            sesion.usuario  = null;
            sesion.iniciada = false;

            paginas.actualizarEnlaces();

            sitio.mostrarPaginaPricipal();

            mensajero.mostrarExito('Se cerró la de sesión correctamente', `¡Hasta pronto ${nombreEntidad}!`);
        }
    },

    // -----------------------------------------------------------------------------------------------------------
    // Registro de usuario (persona)

    registrar()
    {
        // Referencias a los elementos (input) del formuario "Registrar nuevo usuario"

        let campoUsuario        = util.obtenerPorId('usuario-registro');
        let campoNombre         = util.obtenerPorId('nombre-registro');
        let campoApellido       = util.obtenerPorId('apellido-registro');
        let campoClave          = util.obtenerPorId('clave-registro');
        let campoRepetirClave   = util.obtenerPorId('clave-repetir-registro');


        // Valores de texto que contienen los elementos

        let usuario      = campoUsuario.value;
        let nombre       = campoNombre.value;
        let apellido     = campoApellido.value;
        let clave        = campoClave.value;
        let repetirClave = campoRepetirClave.value;


        // Se verifca que no hayan campos sin completar (vacíos)

        if( util.cadenaVacia(usuario)
         || util.cadenaVacia(nombre)
         || util.cadenaVacia(apellido)
         || util.cadenaVacia(clave)
         || util.cadenaVacia(repetirClave)
        )
        {
            mensajero.mostrarError('Es necesario completar todos los campos');
            return;
        }


        // Se verifica que ya no exista un usuario con ese nombre

        if(usuarios.obtenerUsuarioPorNombre(usuario))
        {
            mensajero.mostrarError('Ya existe un usuario con el nombre indicado');
            return;
        }


        // Validación de nombre de usuario

        let permitidosEnNombreUsuario  = 'abcdefghijklmnñopqrstuvwxyz0123456789_';

        let usuarioValido  = util.cadenaValida(usuario,  permitidosEnNombreUsuario,  false);

        if(!usuarioValido)
        {
            mensajero.mostrarError("El campo nombre de usuario contiene caracteres inválidos");
            return;
        }


        // Validación de nombre y apellido

        let permitidosEnNombreApellido = 'abcdefghijklmnñopqrstuvwxyzáéíóúçü ';

        let nombreValido   = util.cadenaValida(nombre,   permitidosEnNombreApellido, false);
        let apellidoValido = util.cadenaValida(apellido, permitidosEnNombreApellido, false);

        if(!nombreValido || !apellidoValido)
        {
            mensajero.mostrarError("El campo nombre y/o apellido contiene caracteres inválidos");
            return;
        }


        // Validación de clave

        if(!usuarios.esClaveValida(clave))
        {
            mensajero.mostrarError('La clave ingresada no cumple con los requisitos mínimos requeridos');
            return;
        }

        if(clave != repetirClave)
        {
            mensajero.mostrarError('Las claves ingresadas no coinciden');
            return;
        }


        // Se agrega la persona a la lista de usuarios

        nombre   = util.primeraLetraEnMayuscula(nombre);
        apellido = util.primeraLetraEnMayuscula(apellido);

        let persona = new Persona(nombre, apellido);

        usuarios.agregarPersona(
            new Usuario(usuario, clave, 'persona', persona)
        );


        // Se muestra la página de inicio de sesión y un mensaje de exito

        sitio.mostrarPaginaIniciarSesion();

        mensajero.mostrarExito(`¡Hola ${nombre}! tu usuario se creó correctamente`, 'Registro exitoso');


        // Se limpian los campos del formulario de registro

        campoUsuario.value = '';
        campoNombre.value = '';
        campoApellido.value = '';
        campoClave.value = '';
        campoRepetirClave.value = '';
    },

    // -----------------------------------------------------------------------------------------------------------
    // Validación de clave

    esClaveValida(clave)
    {
        let mayusculas = 0;
        let minusculas = 0;
        let numeros    = 0;

        if (clave.length < 6)
        {
            return false;
        }

        for (let i = 0; i < clave.length; i++)
        {
            let letra = clave[i];

            if (letra >= "A" && letra <="Z")
                mayusculas++;
            else
            if (letra >= "a" && letra <="z")
                minusculas++;
            else
            if (letra >= "0" && letra <="9")
                numeros++;
        }

        if (mayusculas >= 1 && minusculas >= 1 && numeros >= 1)
        {
            return true;
        }

        return false;
    },

    // -----------------------------------------------------------------------------------------------------------
    // Se consulta en las dos listas (personas y locales) si usuario y clave son correctos

    esValido(nombreUsuario, clave)
    {
        let esUsuarioPersona = usuarios.esValidoDesdeLista(nombreUsuario, clave, usuarios.listaPersonas);
        let esUsuarioLocal   = usuarios.esValidoDesdeLista(nombreUsuario, clave, usuarios.listaLocales);

        // Si es válido en alguna de las listas se retorna verdadero
        if(esUsuarioPersona || esUsuarioLocal)
            return true;

        return false;
    },

    // -----------------------------------------------------------------------------------------------------------
    // Recibe las credenciales del usuario y una lista (puede ser la de personas o la de locales)
    // Si encuentra usuario y clave correctos retorna verdadero, en caso contrario falso

    esValidoDesdeLista(nombreUsuario, clave, lista)
    {
        for(let i = 0; i < lista.length; i++)
        {
            let usuarioEnLista = lista[i];

            let coincideUsuario = usuarioEnLista.nombre.toLowerCase() === nombreUsuario.toLowerCase();
            let coincideClave   = usuarioEnLista.clave === clave;

            if(coincideUsuario && coincideClave)
               return true;
        }
        return false;
    },

    // -----------------------------------------------------------------------------------------------------------
    // Se busca el usuario en las dos listas (personas y locales)

    obtenerUsuarioPorNombre(nombreUsuario)
    {
        let usuarioPersona = usuarios.obtenerUsuarioPorNombreDesdeLista(nombreUsuario, usuarios.listaPersonas);

        if(usuarioPersona != null)
            return usuarioPersona;

        let usuarioLocal = usuarios.obtenerUsuarioPorNombreDesdeLista(nombreUsuario, usuarios.listaLocales);

        if(usuarioLocal != null)
            return usuarioLocal;

        return null;
    },

    // -----------------------------------------------------------------------------------------------------------
    // Recibe el nombre de usuario y una lista (puede ser la de personas o la de locales)
    // Si encuentra el usuario lo retorna en caso contrario retorna null

    obtenerUsuarioPorNombreDesdeLista(nombreUsuario, lista)
    {
        for(let i = 0; i < lista.length; i++)
        {
            let usuarioEnLista = lista[i];

            let coincideUsuario = usuarioEnLista.nombre.toLowerCase() === nombreUsuario.toLowerCase();

            if(coincideUsuario)
                return usuarioEnLista;
        }

        return null;
    },

}