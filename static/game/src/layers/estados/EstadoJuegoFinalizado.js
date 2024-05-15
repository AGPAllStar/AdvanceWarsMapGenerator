class EstadoJuegoFinalizado extends EstadoGameLayer {
    constructor(gameLayer) {
        super(gameLayer);
    }

    getOpcionesDeMenu() {
        var listOptions = new Array();
        var listFunctions = new Array();
        var listTexts = new Array();

        return [listOptions, listFunctions, listTexts];
    }

    dibujar(scrollX, scrollY) {
        
    }
}