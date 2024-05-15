// Lista de recursos a precargar
var staticFolder = "/static/game/";
var cache = [];
var imagenes = {
    icono_puntos : "res/icono_puntos.png",
    icono_mover : "res/icon_move.png",
    icono_atacar : "res/icon_attack.png",
    fondo_2 : "res/fondo_2.png",
    terreno_fondo : "res/tile_background.png",
    terreno_tierra : "res/tile_ground.png",
    terreno_agua : "res/tile_sea.png",
    terreno_bosque : "res/tile_forest.png",
    terreno_montania : "res/tile_mountain.png",
    terreno_carretera : "res/tile_road.png",
    edificio_ciudad : "res/tile_city.png",
    edificio_ciudad_j1 : "res/tile_city_j1.png",
    edificio_ciudad_j2 : "res/tile_city_j2.png",
    edificio_fabrica : "res/tile_factory.png",
    edificio_fabrica_j1 : "res/tile_factory_j1.png",
    edificio_fabrica_j2 : "res/tile_factory_j2.png",
    edificio_aeropuerto : "res/tile_airport.png",
    edificio_aeropuerto_j1 : "res/tile_airport_j1.png",
    edificio_aeropuerto_j2 : "res/tile_airport_j2.png",
    edificio_hq_j1 : "res/tile_hq_j1.png",
    edificio_hq_j2 : "res/tile_hq_j2.png",
    tropa_infanteria_j1: "res/unit_infantry_j1.png",
    tropa_infanteria_j2: "res/unit_infantry_j2.png",
    tropa_tanque_j1: "res/unit_tank_j1.png",
    tropa_tanque_j2: "res/unit_tank_j2.png",
    tropa_helicoptero_j1: "res/unit_helicopter_j1.png",
    tropa_helicoptero_j2: "res/unit_helicopter_j2.png",
    boton_pausa : "res/boton_pausa.png",
    boton_opcion : "res/boton_opcion.png",
    menu_fondo : "res/menu_fondo.png",
    boton_jugar : "res/boton_jugar.png",
    mensaje_como_jugar : "res/mensaje_como_jugar.png",
    mensaje_ganar : "res/mensaje_ganar.png",
    mensaje_perder : "res/mensaje_perder.png",
    marcador_casilla : "res/casilla_marcada.png",
    vida_1_tropa : "res/troop_life_1.png",
    vida_2_tropa : "res/troop_life_2.png",
    vida_3_tropa : "res/troop_life_3.png",
    vida_4_tropa : "res/troop_life_4.png",
    vida_5_tropa : "res/troop_life_5.png",
    vida_6_tropa : "res/troop_life_6.png",
    vida_7_tropa : "res/troop_life_7.png",
    vida_8_tropa : "res/troop_life_8.png",
    vida_9_tropa : "res/troop_life_9.png",
};

var rutasImagenes = Object.values(imagenes);
cargarImagenes(0);

function cargarImagenes(indice){
    cache[rutasImagenes[indice]] = new Image();
    cache[rutasImagenes[indice]].src = staticFolder + rutasImagenes[indice];
    cache[rutasImagenes[indice]].onload = function(){
        if ( indice < rutasImagenes.length-1 ){
            indice++;
            cargarImagenes(indice);
        } else {
            iniciarJuego();
        }
    }
}
