class GroundWithBackgroundTerrain extends Terrain {

    constructor(rutaImagen, x, y, defenseLevel) {
        super(rutaImagen, x, y, defenseLevel);
        this.casillaFondo = new BackgroundTerrain(x, y);
    }

    dibujar(scrollX, scrollY) {
        this.casillaFondo.dibujar(scrollX, scrollY);
        super.dibujar(scrollX, scrollY);
    }
    
}
