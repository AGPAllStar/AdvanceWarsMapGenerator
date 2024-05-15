const TILE_GROUND = "#";
const TILE_SEA = ".";
const TILE_FOREST = "?";
const TILE_MOUNTAIN = "^";
const TILE_ROAD = "=";
const TILE_CITY = "$";
const TILE_AIRPORT = "&";
const TILE_FACTORY = "+";
const TILE_HQ_J1 = "o";
const TILE_HQ_J2 = "O";
const TILE_FACTORY_J1 = "e";
const TILE_FACTORY_J2 = "E";
const TILE_CITY_J1 = "i";
const TILE_CITY_J2 = "I";
const TILE_AIRPORT_J1 = "a";
const TILE_AIRPORT_J2 = "A";

const INIT_MONEY = 10000;
const MAX_TROOP_LIFE = 10;

const INFANTRY_COST = 1000;
const TANK_COST = 7000;
const HELICOPTER_COST = 9000;

class Game {

    constructor(arrayStrMap, nPlayers) {
        this.map = this.convertMap(arrayStrMap);
        this.players = new Array();
        this.playersLost = new Array();
        for(let i = 1;i <= nPlayers;i++) {
            this.players.push(new Player(i, INIT_MONEY));
            this.playersLost.push(false);
        }
        this.actualPlayer = this.players[0];
    }

    getCoordsOfTileInMap(tile) {
        for (let i = 0;i < this.map.length; i++) {
            for (let j = 0;j < this.map[i].length; j++) {
                if (this.map[i][j] === tile) {
                    return { row: i, col: j };
                }
            }
        }
        return { row: -1, col: -1 };
    }

    getTileOfTroop(troop) {
        for (let i = 0;i < this.map.length; i++) {
            for (let j = 0;j < this.map[i].length; j++) {
                if (this.map[i][j].troop === troop) {
                    return this.map[i][j];
                }
            }
        }
        return null;
    }

    moveTroop(tileTroop, tileEnd) {
        var endCoords = this.getCoordsOfTileInMap(tileEnd);
        if(!this.checkMoveCanBeDone(tileTroop, tileEnd)){
            return false;
        }
        return tileTroop.troop.move(endCoords.row, endCoords.col, this);
    }

    attackTroop(tileAllyTroop, tileEnemyTroop) {
        if(!this.checkAttackCanBeDone(tileAllyTroop, tileEnemyTroop)) {
            return false;
        }
        var result = tileAllyTroop.troop.attack(tileEnemyTroop, this);
        if(tileEnemyTroop.troop.life <= 0){
            tileEnemyTroop.troop = null;
        }
        return result;
    }

    conquerBuilding(building) {
        if(!this.checkConquerIsAvailable(building)){
            return false;
        }
        var previousplayerOwnerId = building.playerOwnerId;
        var result = building.beConquered(this.actualPlayer.id);
        if(result == true && building instanceof HQBuilding){
            this.playersLost[previousplayerOwnerId - 1] = true;
        }
        return true;
    }

    invokeTroop(troopStr, building) {
        if(!this.checkInvokeIsAvailable(building)) {
            return false;
        }
        var newTroop = null;
        if(troopStr == "infantry"){
            newTroop = new InfantryTroop(building.x, building.y, this.actualPlayer.id, building);
        }else if(troopStr == "tank"){
            newTroop = new TankTroop(building.x, building.y, this.actualPlayer.id, building);
        }else if(troopStr == "helicopter"){
            newTroop = new HelicopterTroop(building.x, building.y, this.actualPlayer.id, building);
        }else{
            return false;
        }
        if(this.actualPlayer.money >= newTroop.cost){
            building.troop = newTroop;
            this.actualPlayer.money -= newTroop.cost;
            return true;
        }else{
            return false;
        }
    }

    finishTurn() {
        var indexActualPlayer = this.actualPlayer.id - 1;
        for(let row = 0;row < this.map.length;row++){
            for(let col = 0;col < this.map[row].length;col++){
                if(this.map[row][col].troop != null) {
                    this.map[row][col].troop.moveAvailable = true;
                    this.map[row][col].troop.attackAvailable = true;
                }
                if(this.map[row][col] instanceof Building){
                    this.map[row][col].conquerAvailable = true;
                }
            }
        }
        if(indexActualPlayer + 1 == this.players.length){
            indexActualPlayer = 0;
        }else{
            indexActualPlayer++;
        }
        this.actualPlayer = this.players[indexActualPlayer];
        this.getMoneyForCities();
    }

    isGameFinished() {
        var playersAlive = 0;
        for(let playerId = 1;playerId <= this.playersLost.length;playerId++){
            if(!this.playersLost[playerId - 1]) {
                playersAlive++;
            }
        }
        return playersAlive <= 1;
    }

    getWinnerId() {
        if(this.isGameFinished()) {
            for(let playerId = 1;playerId <= this.playersLost.length;playerId++) {
                if(!this.playersLost[playerId - 1]) {
                    return playerId;
                }
            }
        }
        return null;
    }

    getMoneyForCities() {
        for(let row = 0;row < this.map.length;row++){
            for(let col = 0;col < this.map[row].length;col++){
                if(this.map[row][col] instanceof CityBuilding && this.map[row][col].playerOwnerId == this.actualPlayer.id){
                    this.actualPlayer.money += 1000;
                }
            }
        }
    }

    getReachableTilesMoving(tile) {
        var troop = tile.troop;
        if(troop == null) {
            return new Set();
        }
        var tileCoords = this.getCoordsOfTileInMap(tile);
        var visited = new Set();
        var tail = [[[tileCoords.row, tileCoords.col], 0]];
        var movements = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    
        while (tail.length > 0) {
            var [[x, y], distance] = tail.shift();
    
            for (var [dx, dy] of movements) {
                var newX = x + dx;
                var newY = y + dy;
    
                if ((newX != tileCoords.row || newY != tileCoords.col) && newX >= 0 && newX < this.map.length && newY >= 0 && newY < this.map[0].length && this.map[newX][newY].canTroopPassThrough(troop) && !visited.has(this.map[newX][newY]) && distance < troop.range) {
                    tail.push([[newX, newY], distance + 1]);
                    visited.add(this.map[newX][newY]);
                }
            }
        }
    
        return visited;
    }

    getReachableTilesAttacking(tile) {
        var troop = tile.troop;
        if(troop == null) {
            return new Set();
        }
        var tileCoords = this.getCoordsOfTileInMap(tile);
        var visited = new Set();
        var tail = [[[tileCoords.row, tileCoords.col], 0]];
        var movements = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    
        while (tail.length > 0) {
            var [[x, y], distance] = tail.shift();
    
            for (var [dx, dy] of movements) {
                var newX = x + dx;
                var newY = y + dy;
    
                if ((newX != tileCoords.row || newY != tileCoords.col) && newX >= 0 && newX < this.map.length && newY >= 0 && newY < this.map[0].length && !visited.has(this.map[newX][newY]) && distance < troop.reach) {
                    tail.push([[newX, newY], distance + 1]);
                    visited.add(this.map[newX][newY]);
                }
            }
        }
    
        return visited;
    }

    checkMoveIsAvailable(selectedTileInGame) {
        return selectedTileInGame != null && selectedTileInGame.troop != null && selectedTileInGame.troop.playerId == this.actualPlayer.id && selectedTileInGame.troop.moveAvailable;
    }

    checkMoveCanBeDone(initSelectedTileInGame, endSelectedTileInGame) {
        return this.checkMoveIsAvailable(initSelectedTileInGame) && endSelectedTileInGame.troop == null
            && this.getReachableTilesMoving(initSelectedTileInGame).has(endSelectedTileInGame);
    }

    checkAttackIsAvailable(selectedTileInGame) {
        return selectedTileInGame.troop != null && selectedTileInGame.troop.playerId == this.actualPlayer.id && selectedTileInGame.troop.attackAvailable;
    }

    checkAttackCanBeDone(initSelectedTileInGame, endSelectedTileInGame) {
        return this.checkAttackIsAvailable(initSelectedTileInGame) && endSelectedTileInGame.troop != null && endSelectedTileInGame.troop.playerId != this.actualPlayer.id
            && this.getReachableTilesAttacking(initSelectedTileInGame).has(endSelectedTileInGame);
    }

    checkConquerIsAvailable(selectedTileInGame) {
        return selectedTileInGame instanceof Building && selectedTileInGame.troop != null && selectedTileInGame.playerOwnerId != this.actualPlayer.id && selectedTileInGame.troop.playerId == this.actualPlayer.id && selectedTileInGame.conquerAvailable;
    }

    checkInvokeIsAvailable(selectedTileInGame) {
        return (selectedTileInGame instanceof FactoryBuilding || selectedTileInGame instanceof AirportBuilding) && selectedTileInGame.playerOwnerId == this.actualPlayer.id && selectedTileInGame.troop == null;
    }

    convertMap(arrayStrMap){
        var newMap = new Array();
        for(let row = 0;row < arrayStrMap.length;row++){
            var arrayRow = new Array();
            for(let col = 0;col < arrayStrMap[row].length;col++){
                var x = 16/2 + col * 16; // x central
                var y = 16 + row * 16; // y de abajo
                if(arrayStrMap[row][col] == TILE_GROUND){
                    arrayRow.push(new GroundTerrain(x, y));
                }else if(arrayStrMap[row][col] == TILE_SEA){
                    arrayRow.push(new WaterTerrain(x, y));
                }else if(arrayStrMap[row][col] == TILE_FOREST){
                    arrayRow.push(new ForestTerrain(x, y));
                }else if(arrayStrMap[row][col] == TILE_MOUNTAIN){
                    arrayRow.push(new MountainTerrain(x, y));
                }else if(arrayStrMap[row][col] == TILE_ROAD){
                    arrayRow.push(new RoadTerrain(x, y));
                }else if(arrayStrMap[row][col] == TILE_FACTORY){
                    arrayRow.push(new FactoryBuilding(x, y, -1));
                }else if(arrayStrMap[row][col] == TILE_FACTORY_J1){
                    arrayRow.push(new FactoryBuilding(x, y, 1));
                }else if(arrayStrMap[row][col] == TILE_FACTORY_J2){
                    arrayRow.push(new FactoryBuilding(x, y, 2));
                }else if(arrayStrMap[row][col] == TILE_CITY){
                    arrayRow.push(new CityBuilding(x, y, -1));
                }else if(arrayStrMap[row][col] == TILE_CITY_J1){
                    arrayRow.push(new CityBuilding(x, y, 1));
                }else if(arrayStrMap[row][col] == TILE_CITY_J2){
                    arrayRow.push(new CityBuilding(x, y, 2));
                }else if(arrayStrMap[row][col] == TILE_AIRPORT){
                    arrayRow.push(new AirportBuilding(x, y, -1));
                }else if(arrayStrMap[row][col] == TILE_AIRPORT_J1){
                    arrayRow.push(new AirportBuilding(x, y, 1));
                }else if(arrayStrMap[row][col] == TILE_AIRPORT_J2){
                    arrayRow.push(new AirportBuilding(x, y, 2));
                }else if(arrayStrMap[row][col] == TILE_HQ_J1){
                    arrayRow.push(new HQBuilding(x, y, 1));
                }else if(arrayStrMap[row][col] == TILE_HQ_J2){
                    arrayRow.push(new HQBuilding(x, y, 2));
                }
            }
            if(arrayRow.length > 0){
                newMap.push(arrayRow);
            }
        }
        return newMap;
    }

}