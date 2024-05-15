class EstadoNulo extends EstadoGameLayer {
    constructor(gameLayer) {
        super(gameLayer);
    }

    marcarCasilla(casilla) {
        this.gameLayer.estado = new EstadoCasillaMarcada(this.gameLayer,  casilla);
    }
}