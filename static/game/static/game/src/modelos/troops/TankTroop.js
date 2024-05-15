class TankTroop extends GroundTroop{

    constructor(x, y, playerId, terrain){
        var image = null;
        if(playerId == 1){
            image = imagenes.tropa_tanque_j1;
        }else if(playerId == 2) {
            image = imagenes.tropa_tanque_j2;
        }
        super(image, x, y, 10, 1, 6, TANK_COST, playerId, terrain);
    }

}