class FactoryBuilding extends Building {

    constructor(x, y, playerOwnerId) {
        var image = null;
        if(playerOwnerId == 1){
            image = imagenes.edificio_fabrica_j1;
        }else if(playerOwnerId == 2) {
            image = imagenes.edificio_fabrica_j2;
        }else{
            image = imagenes.edificio_fabrica;
        }
        super(image, x, y, 3, playerOwnerId);
    }

    beConquered(playerId) {
        var result = super.beConquered(playerId);
        if(playerId == 1){
            this.imagen = cache[imagenes.edificio_fabrica_j1];
        }else if(playerId == 2) {
            this.imagen = cache[imagenes.edificio_fabrica_j2];
        }else{
            this.imagen = cache[imagenes.edificio_fabrica];
        }
        return result;
    }
    
}