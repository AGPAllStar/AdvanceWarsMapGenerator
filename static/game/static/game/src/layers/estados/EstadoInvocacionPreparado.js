class EstadoInvocacionPreparado extends EstadoGameLayer {
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
        if(this.gameLayer.game.checkInvokeIsAvailable(this.casillaMarcada)) {
            if(this.casillaMarcada instanceof FactoryBuilding) {
                if(this.gameLayer.game.actualPlayer.money >= 1000) {
                    listOptions.push(new Boton(imagenes.boton_opcion, this.casillaMarcada.x + 48, this.casillaMarcada.y + ySum + 16));
                    listFunctions.push(this.gameLayer.invocarInfanteria);
                    listTexts.push(new Texto("Invocar infantería", this.casillaMarcada.x + 16, this.casillaMarcada.y + ySum + 16));
                    ySum += 36;
                }
    
                if(this.gameLayer.game.actualPlayer.money >= 7000) {
                    listOptions.push(new Boton(imagenes.boton_opcion, this.casillaMarcada.x + 48, this.casillaMarcada.y + ySum + 16));
                    listFunctions.push(this.gameLayer.invocarTanque);
                    listTexts.push(new Texto("Invocar tanque", this.casillaMarcada.x + 16, this.casillaMarcada.y + ySum + 16));
                    ySum += 36;
                }
            }else if(this.casillaMarcada instanceof AirportBuilding) {
                if(this.gameLayer.game.actualPlayer.money >= 9000) {
                    listOptions.push(new Boton(imagenes.boton_opcion, this.casillaMarcada.x + 48, this.casillaMarcada.y + ySum + 16));
                    listFunctions.push(this.gameLayer.invocarHelicoptero);
                    listTexts.push(new Texto("Invocar helicóptero", this.casillaMarcada.x + 16, this.casillaMarcada.y + ySum + 16));
                    ySum += 36;
                }
            }
        }
        
        listOptions.push(new Boton(imagenes.boton_opcion, this.casillaMarcada.x + 48, this.casillaMarcada.y + ySum + 16));
        listFunctions.push(this.gameLayer.cancelar);
        listTexts.push(new Texto("Cancelar", this.casillaMarcada.x + 16, this.casillaMarcada.y + ySum + 16));

        return [listOptions, listFunctions, listTexts];
    }

    dibujar(scrollX, scrollY) {
        this.imagenCasillaMarcada.dibujar(scrollX, scrollY);
    }
}