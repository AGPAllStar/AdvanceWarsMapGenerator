class EstadoMovimientoCasillaMarcada extends EstadoGameLayer {
    constructor(gameLayer, casillaMarcada, casillaMarcada2) {
        super(gameLayer);
        this.casillaMarcada = casillaMarcada;
        this.casillaMarcada2 = casillaMarcada2;
        this.imagenCasillaMarcada = new Modelo(imagenes.marcador_casilla, casillaMarcada.x, casillaMarcada.y);
        this.imagenCasillaMarcada2 = new Modelo(imagenes.marcador_casilla, casillaMarcada2.x, casillaMarcada2.y);
    }

    getOpcionesDeMenu() {
        var listOptions = new Array();
        var listFunctions = new Array();
        var listTexts = new Array();
        var ySum = 0;
        if(this.gameLayer.game.checkMoveCanBeDone(this.casillaMarcada, this.casillaMarcada2)) {
            listOptions.push(new Boton(imagenes.boton_opcion, this.casillaMarcada2.x + 48, this.casillaMarcada2.y + ySum + 16));
            listFunctions.push(this.gameLayer.mover);
            listTexts.push(new Texto("Confirmar movimiento", this.casillaMarcada2.x + 16, this.casillaMarcada2.y + ySum + 16));
            ySum += 36;
        }
        
        listOptions.push(new Boton(imagenes.boton_opcion, this.casillaMarcada2.x + 48, this.casillaMarcada2.y + ySum + 16));
        listFunctions.push(this.gameLayer.cancelar);
        listTexts.push(new Texto("Cancelar", this.casillaMarcada2.x + 16, this.casillaMarcada2.y + ySum + 16));

        return [listOptions, listFunctions, listTexts];
    }

    marcarCasilla(casilla) {
        this.gameLayer.estado = new EstadoMovimientoCasillaMarcada(this.gameLayer, this.casillaMarcada,  casilla); 
    }

    dibujar(scrollX, scrollY) {
        this.imagenCasillaMarcada.dibujar(scrollX, scrollY);
        this.imagenCasillaMarcada2.dibujar(scrollX, scrollY);
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