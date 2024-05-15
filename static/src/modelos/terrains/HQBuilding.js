class HQBuilding extends Building {

    constructor(x, y, playerOwnerId) {
        var image = null;
        if(playerOwnerId == 1){
            image = imagenes.edificio_hq_j1;
        }else if(playerOwnerId == 2) {
            image = imagenes.edificio_hq_j2;
        }
        super(image, x, y, 4, playerOwnerId);
    }

    beConquered(playerId) {
        var result = super.beConquered(playerId);
        if(playerId == 1){
            this.imagen = cache[imagenes.edificio_hq_j1];
        }else if(playerId == 2) {
            this.imagen = cache[imagenes.edificio_hq_j2];
        }
        return result;
    }
    
}