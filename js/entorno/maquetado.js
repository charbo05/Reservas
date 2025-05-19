"use strict";

const maquetado = {

    limiteScroll: 50,
    limiteScrollAlcanzado: false,

    alCargarSitio()
    {
        maquetado.alHacerScroll();
    },

    alHacerScroll()
    {
        document.addEventListener('scroll', function(e) {

            let seCruzoLimite = false;
            let posicion = window.scrollY;

            if(posicion > maquetado.limiteScroll && maquetado.limiteScrollAlcanzado == false)
            {
               maquetado.limiteScrollAlcanzado = true;
               seCruzoLimite = true;
            }

            if(posicion <= maquetado.limiteScroll    && maquetado.limiteScrollAlcanzado == true)
            {
                maquetado.limiteScrollAlcanzado = false;
                seCruzoLimite = true;
            }

            if(seCruzoLimite)
            {
                maquetado.cambiarFondoCabecera();
                maquetado.cambiarUbicacionMenus();
            }
        })
    },

    cambiarFondoCabecera()
    {
        if(maquetado.limiteScrollAlcanzado)
        {
            util.obtenerPorId('cabecera').style.backgroundColor = 'white';
        }

        if(!maquetado.limiteScrollAlcanzado)
        {
            util.obtenerPorId('cabecera').style.backgroundColor = 'rgba(255,255,255,0.9)';
        }
    },

    cambiarUbicacionMenus()
    {
        if(!maquetado.limiteScrollAlcanzado)
        {
            util.obtenerPorId('menu').classList.remove('menu-al-scroll');
            let subir = util.obtenerPorSelector('#menu .subir');
            if(subir)
                subir.style.display = 'none';
        }

        if(maquetado.limiteScrollAlcanzado)
        {
            util.obtenerPorId('menu').classList.add('menu-al-scroll');
            let subir = util.obtenerPorSelector('#menu .subir');
            if(subir)
                subir.style.display = 'inline';
        }
    },

}

maquetado.alCargarSitio();

