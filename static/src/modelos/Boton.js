class Boton extends Modelo {

    constructor(rutaImagen, x, y) {
        super(rutaImagen, x, y)
        this.pulsado = false;
    }

    contienePunto(pX, pY, scrollX = 0, scrollY = 0){
        if ( pY >= this.y - this.alto/2 - scrollY &&
            pY <= this.y + this.alto/2 - scrollY &&
            pX <= this.x + this.ancho/2 - scrollX &&
            pX >= this.x - this.ancho/2 - scrollX){
            return true;
        }
        return false;
    }

}
