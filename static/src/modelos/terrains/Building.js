class Building extends GroundWithBackgroundTerrain {

    constructor(rutaImagen, x, y, defenseLevel, playerOwnerId) {
        super(rutaImagen, x, y, defenseLevel);
        this.playerOwnerId = playerOwnerId;
        this.conquerAvailable = true;
    }

    beConquered(playerId) {
        this.playerOwnerId = playerId;
        this.conquerAvailable = false;
        return true;
    }
    
}