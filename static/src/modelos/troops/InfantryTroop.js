class InfantryTroop extends GroundTroop{

    constructor(x, y, playerId, terrain){
        var image = null;
        if(playerId == 1){
            image = imagenes.tropa_infanteria_j1;
        }else if(playerId == 2) {
            image = imagenes.tropa_infanteria_j2;
        }
        super(image, x, y, 10, 1, 3, INFANTRY_COST, playerId, terrain);
    }

}