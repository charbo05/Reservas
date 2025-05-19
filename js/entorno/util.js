"use strict";

const util = {

    contadorIDs: 0,

    generarId()
    {
        return ++this.contadorIDs;
    },

    esEnteroPositivo(numero)
    {
        if(isNaN(numero) || numero < 0)
            return false;

        if(parseInt(numero) != numero)
            return false;

        return true;
    },

    esBooleano(valor)
    {
        return valor === true || valor === false;
    },

    primeraLetraEnMayuscula(texto)
    {
        return texto.charAt(0).toUpperCase() + texto.slice(1,texto.length).toLowerCase();
    },

    cadenaVacia(texto)
    {
        if (typeof texto === 'string' || texto instanceof String)
        {
            return texto.trim().length === 0;
        }
        return true;
    },

    cadenaValida(texto, caracteresValidos, considerarMayusculasMinusculas = true)
    {
        if(considerarMayusculasMinusculas === false)
        {
            texto = texto.toLowerCase();
            caracteresValidos = caracteresValidos.toLowerCase();
        }

        for(let i = 0; i < texto.length; i++)
        {
            if(caracteresValidos.includes(texto[i]) === false)
            {
                return false;
            }
        }
        return true;
    },

    insertar(objetivo, html)
    {
        document.querySelector(objetivo).innerHTML = html;
    },

    obtenerPorId(id)
    {
        return document.getElementById(id);
    },

    obtenerPorSelector(selector)
    {
        return document.querySelector(selector);
    },

    obtenerTodosPorSelector(selector)
    {
        return document.querySelectorAll(selector);
    },

    promedio(arrayNumeros)
    {
        let promedio = 0;

        for(let i = 0; i < arrayNumeros.length; i++)
        {
            promedio += arrayNumeros[i];
        }

        promedio /= arrayNumeros.length;

        return promedio;
    },

    existeEnArray(arrayBusqueda, valor)
    {
        for(let i = 0; i < arrayBusqueda.length; i++)
        {
            if(arrayBusqueda[i] === valor)
            {
                return true;
            }
        }
        return false;
    },

    registrarEventosSelector(selector, tipoEvento, funcion)
    {
        document.querySelectorAll(selector).forEach(function(boton){
            boton.addEventListener(tipoEvento, funcion);
        });
    },

    destacarFilasTabla()
    {
        let idTabla = this.dataset.idTabla;
        let columnaTabla  = this.dataset.columnaTabla -1;

        let tabla = util.obtenerPorId(idTabla);

        for (let fila of tabla.rows)
        {
            for(let celda of fila.cells)
            {
                if(celda.nodeName === 'TD' && celda.cellIndex === columnaTabla)
                {
                    if(celda.innerText.toLowerCase().includes(this.value.toLowerCase()))
                    {
                        fila.style.opacity = '1';
                    }
                    else{
                        fila.style.opacity = '0.3';
                    }
                }
            }
        }
    },

    filtrarFilasTabla()
    {
        let idTabla = this.dataset.idTabla;
        let columnaTabla  = this.dataset.columnaTabla -1;
        let tabla = util.obtenerPorId(idTabla);

        for (let fila of tabla.rows)
        {
            for(let celda of fila.cells)
            {
                if(celda.nodeName === 'TD' && celda.cellIndex === columnaTabla)
                {
                    if(celda.innerText.toLowerCase().includes(this.value.toLowerCase()))
                    {
                        fila.style.display = '';
                    }
                    else{
                        fila.style.display = 'none';
                    }
                }
            }
        }
    },

    filtrarDivsConTexto()
    {
        let _this =  this;
        let clase = this.dataset.claseCssDivs;
        let divs = util.obtenerTodosPorSelector('.'+clase);

        divs.forEach( function(div)
        {
            if(div.textContent.toLowerCase().includes(_this.value.toLowerCase()))
            {
                div.style.display = '';
            }
            else
            {
                div.style.display = 'none';
            }
        });
    },

    // 138 es la cantidad de pixeles que mide desde el inicio de la primer estrella
    // hasta el final de la última estrella. Se usa en el calculo para saber cuanto
    // de las estrellas tienen que estar pintadas de color amarillo
    // (El valor debe ser entre 1 y 5)
    nivelEstrellas(valor)
    {
        return (138 - valor * 138 / 5).toFixed(2);
    },

    // Porcentaje entre 1 y 100
    nivelBarras(porcentaje)
    {
        return (150 - porcentaje * 150 / 100).toFixed(2);
    },

}
