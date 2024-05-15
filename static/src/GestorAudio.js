var staticFolder = "/static/";
var musicaAmbiente = new Audio(staticFolder + "res/musica_ambiente.mp3");
musicaAmbiente.loop = true;

var efectos = {
    disparo : staticFolder + "res/efecto_disparo.mp3",
    explosion : staticFolder + "res/efecto_explosion.mp3",
}

function reproducirMusica() {
    musicaAmbiente.play();
}

function pararMusica() {
    musicaAmbiente.stop();
}

function reproducirEfecto( srcEfecto ) {
    var efecto = new Audio( srcEfecto );
    efecto.play();
}
