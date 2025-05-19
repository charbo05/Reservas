"use strict";

// ---------------------------------------------------------------------------------------------------------------
//
//  CLASE PERSONA
//

class Persona {

    id       = null;
    nombre   = null;
    apellido = null;

    constructor(nombre, apellido)
    {
        this.id       = util.generarId();
        this.nombre   = nombre;
        this.apellido = apellido;
    }

    nombreApellido()
    {
        return this.nombre + ' ' + this.apellido;
    }

}

// ------------------------------------------------------------------------------------------------------------------
//
//  GESTOR DE PERSONAS (OBJETO)
//

const personas = {

    listaPersonas: [],

    // -----------------------------------------------------------------------------------------------------------
    // Agrega una persona a listaPersonas (debe ser un objeto Persona)

    agregar(persona)
    {
        personas.listaPersonas.push(persona);
    },

}