class HelicopterTroop extends AirTroop{

    constructor(x, y, playerId, terrain){
        var image = null;
        if(playerId == 1){
            image = imagenes.tropa_helicoptero_j1;
        }else if(playerId == 2) {
            image = imagenes.tropa_helicoptero_j2;
        }
        super(image, x, y, 10, 1, 6, HELICOPTER_COST, playerId, terrain);
    }

}