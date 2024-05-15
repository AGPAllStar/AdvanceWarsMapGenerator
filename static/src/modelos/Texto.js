class Texto {

    constructor(valor, x, y) {
        this.valor = valor;
        this.x = x;
        this.y = y;
    }

    dibujar(scrollX = 0, scrollY = 0){
        contexto.font = "20px Arial";
        contexto.fillStyle = "white";
        contexto.textAlign = "left";
        contexto.fillText(this.valor,this.x - scrollX,this.y - scrollY);
    }

}
