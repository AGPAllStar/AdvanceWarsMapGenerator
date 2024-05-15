class WaterTerrain extends Terrain {

    constructor(x, y) {
        super(imagenes.terreno_agua, x, y, 0);
    }

    canTroopPassThrough(troop) {
        return troop instanceof AirTroop;
    }
    
}