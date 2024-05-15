class Troop extends Modelo{

    constructor(imagenRuta, x, y, life, reach, range, cost, playerId, terrain) {
        super(imagenRuta, x, y);
        this.life = life;
        this.reach = reach;
        this.range = range;
        this.cost = cost;
        this.playerId = playerId;
        terrain.troop = this;

        this.moveAvailable = true;
        this.attackAvailable = true;
    }

    attack(enemyTerrain, game) {
        var allyTerrain = game.getTileOfTroop(this);
        var enemyTroop = enemyTerrain.troop;
        var tilesReachableAttacking = game.getReachableTilesAttacking(allyTerrain);
        if(enemyTroop == null || !tilesReachableAttacking.has(enemyTerrain) || !this.attackAvailable){
            return false;
        }
        var lifeToLose =  Math.ceil(this.life * (MAX_TROOP_LIFE/enemyTroop.life) / enemyTerrain.defenseLevel);
        enemyTroop.life -= lifeToLose;
        this.attackAvailable = false;
        switch(enemyTroop.life) {
            case 1:
                enemyTroop.imagenVida = new Modelo(imagenes.vida_1_tropa, enemyTroop.x, enemyTroop.y);
                break;
            case 2:
                enemyTroop.imagenVida = new Modelo(imagenes.vida_2_tropa, enemyTroop.x, enemyTroop.y);
                break;
            case 3:
                enemyTroop.imagenVida = new Modelo(imagenes.vida_3_tropa, enemyTroop.x, enemyTroop.y);
                break;
            case 4:
                enemyTroop.imagenVida = new Modelo(imagenes.vida_4_tropa, enemyTroop.x, enemyTroop.y);
                break;
            case 5:
                enemyTroop.imagenVida = new Modelo(imagenes.vida_5_tropa, enemyTroop.x, enemyTroop.y);
                break;
            case 6:
                enemyTroop.imagenVida = new Modelo(imagenes.vida_6_tropa, enemyTroop.x, enemyTroop.y);
                break;
            case 7:
                enemyTroop.imagenVida = new Modelo(imagenes.vida_7_tropa, enemyTroop.x, enemyTroop.y);
                break;
            case 8:
                enemyTroop.imagenVida = new Modelo(imagenes.vida_8_tropa, enemyTroop.x, enemyTroop.y);
                break;
            case 9:
                enemyTroop.imagenVida = new Modelo(imagenes.vida_9_tropa, enemyTroop.x, enemyTroop.y);
                break;
        }
        return true;
    }

    move(x, y, game) {
        if(x < 0 || x >= game.map.length || y < 0 || y >= game.map[0].length || !this.moveAvailable){
            return false;
        }
        var initTile = game.getTileOfTroop(this);
        var tilesReachableMoving = game.getReachableTilesMoving(initTile);
        if(tilesReachableMoving.has(game.map[x][y])){
            initTile.troop = null;
            game.map[x][y].troop = this;
            this.moveAvailable = false;
            this.x = game.map[x][y].x;
            this.y = game.map[x][y].y;
            if(this.imagenVida != null){
                this.imagenVida.x = this.x;
                this.imagenVida.y = this.y;
            }
            return true;
        }
        return false;
    }

    dibujar(scrollX, scrollY) {
        super.dibujar(scrollX, scrollY);
        if(this.imagenVida != null) {
            this.imagenVida.dibujar(scrollX, scrollY);
        }
    }

}