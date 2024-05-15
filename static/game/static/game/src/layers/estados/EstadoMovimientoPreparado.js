class EstadoMovimientoPreparado extends EstadoGameLayer {
    constructor(gameLayer, casillaMarcada) {
        super(gameLayer);
        this.casillaMarcada = casillaMarcada;
        this.imagenCasillaMarcada = new Modelo(imagenes.marcador_casilla, casillaMarcada.x, casillaMarcada.y);
    }

    marcarCasilla(casilla) {
        this.gameLayer.estado = new EstadoMovimientoCasillaMarcada(this.gameLayer, this.casillaMarcada,  casilla); 
    }

    dibujar(scrollX, scrollY) {
        this.imagenCasillaMarcada.dibujar(scrollX, scrollY);
        if(this.rangoDeAccion == null) {
            var casillas = this.gameLayer.game.getReachableTilesMoving(this.casillaMarcada);
            this.rangoDeAccion = new Array();
            for(let casilla of casillas) {
                var iconoAccion = new Modelo(imagenes.icono_mover, casilla.x, casilla.y);
                this.rangoDeAccion.push(iconoAccion);
            }
        }
        for(let i = 0;i < this.rangoDeAccion.length;i++) {
            this.rangoDeAccion[i].dibujar(scrollX, scrollY);
        }
    }
}