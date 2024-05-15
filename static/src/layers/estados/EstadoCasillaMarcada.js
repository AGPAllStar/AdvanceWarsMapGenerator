class EstadoCasillaMarcada extends EstadoGameLayer {
    constructor(gameLayer, casillaMarcada) {
        super(gameLayer);
        this.casillaMarcada = casillaMarcada;
        this.imagenCasillaMarcada = new Modelo(imagenes.marcador_casilla, casillaMarcada.x, casillaMarcada.y);
    }

    getOpcionesDeMenu() {
        var listOptions = new Array();
        var listFunctions = new Array();
        var listTexts = new Array();
        var ySum = 0;
        if(this.gameLayer.game.checkMoveIsAvailable(this.casillaMarcada)) {
            listOptions.push(new Boton(imagenes.boton_opcion, this.casillaMarcada.x + 48, this.casillaMarcada.y + ySum + 16));
            listFunctions.push(this.gameLayer.prepararMovimiento);
            listTexts.push(new Texto("Mover", this.casillaMarcada.x + 16, this.casillaMarcada.y + ySum + 16));
            ySum += 36;
        }
        if(this.gameLayer.game.checkAttackIsAvailable(this.casillaMarcada)) {
            listOptions.push(new Boton(imagenes.boton_opcion, this.casillaMarcada.x + 48, this.casillaMarcada.y + ySum + 16));
            listFunctions.push(this.gameLayer.prepararAtaque);
            listTexts.push(new Texto("Atacar", this.casillaMarcada.x + 16, this.casillaMarcada.y + ySum + 16));
            ySum += 36;
        }
        if(this.gameLayer.game.checkConquerIsAvailable(this.casillaMarcada)) {
            listOptions.push(new Boton(imagenes.boton_opcion, this.casillaMarcada.x + 48, this.casillaMarcada.y + ySum + 16));
            listFunctions.push(this.gameLayer.conquistar);
            listTexts.push(new Texto("Conquistar", this.casillaMarcada.x + 16, this.casillaMarcada.y + ySum + 16));
            ySum += 36;
        }
        if(this.gameLayer.game.checkInvokeIsAvailable(this.casillaMarcada)) {
            listOptions.push(new Boton(imagenes.boton_opcion, this.casillaMarcada.x + 48, this.casillaMarcada.y + ySum + 16));
            listFunctions.push(this.gameLayer.prepararInvocacion);
            listTexts.push(new Texto("Invocar", this.casillaMarcada.x + 16, this.casillaMarcada.y + ySum + 16));
            ySum += 36;
        }

        listOptions.push(new Boton(imagenes.boton_opcion, this.casillaMarcada.x + 48, this.casillaMarcada.y + ySum + 16));
        listFunctions.push(this.gameLayer.cancelar);
        listTexts.push(new Texto("Cancelar", this.casillaMarcada.x + 16, this.casillaMarcada.y + ySum + 16));
        
        return [listOptions, listFunctions, listTexts];
    }

    marcarCasilla(casilla) {
        this.gameLayer.estado = new EstadoCasillaMarcada(this.gameLayer,  casilla);
    }

    dibujar(scrollX, scrollY) {
        this.imagenCasillaMarcada.dibujar(scrollX, scrollY);
    }
}