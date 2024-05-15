import random

from fileUtil import saveMapToFile

TILE_GROUND = "#"
TILE_SEA = "."
TILE_FOREST = "?"
TILE_MOUNTAINS = "^"
TILE_ROAD = "="
TILE_CITY = "$"
TILE_AIRPORT = "&"
TILE_FACTORY = "+"
TILE_HQ_J1 = "o"
TILE_HQ_J2 = "O"
TILE_FACTORY_J1 = "e"
TILE_FACTORY_J2 = "E"
TILE_CITY_J1 = "i"
TILE_CITY_J2 = "I"
TILE_AIRPORT_J1 = "a"
TILE_AIRPORT_J2 = "A"

TILE_EMPTY = "N"

tiles = [TILE_GROUND, TILE_SEA, TILE_FOREST, TILE_MOUNTAINS, TILE_ROAD, TILE_CITY, 
         TILE_AIRPORT, TILE_FACTORY, TILE_HQ_J1, TILE_HQ_J2, TILE_FACTORY_J1, TILE_FACTORY_J2, 
         TILE_CITY_J1, TILE_CITY_J2, TILE_AIRPORT_J1, TILE_AIRPORT_J2]

maxRoads = 10
attemptsToCreateMap = 1000

def getRandomElementWithPriority(cells, weigths):
    sumWeigths = 0
    for w in weigths:
        sumWeigths += w
    rand = random.random() * sumWeigths
    acum = 0
    for i in range(len(cells)):
        acum += weigths[i]
        if (rand < acum):
            return cells[i]
        
def generateRandomMap(mapWidth, mapHeight):
    mapTerms = {"roads": random.randrange(0, maxRoads + 1)}
    return generateRandomMapWithTerms(mapWidth, mapHeight, mapTerms)

def generateRandomMapWithTerms(mapWidth, mapHeight, mapTerms):
    randomMap = []
    for i in range(mapHeight):
        row = []
        for j in range(mapWidth):
            row.append(TILE_EMPTY)
        randomMap.append(row)
    
    putCharInRandomCell(randomMap, TILE_HQ_J1)
    putCharInRandomCell(randomMap, TILE_HQ_J2)

    if(mapTerms != None):
        result = generateTerms(randomMap, mapTerms)
        if(not result):
            return None
    
    for i in range(mapHeight):
        for j in range(mapWidth):
            if(randomMap[i][j] != TILE_EMPTY):
                continue
            availableTiles, availableTilesWeigths = checkAvailableTiles(randomMap, i, j)
            randomTile = getRandomElementWithPriority(availableTiles, availableTilesWeigths)
            if(randomTile == TILE_FACTORY_J1):
                putCharInRandomCell(randomMap, TILE_FACTORY_J2)
            elif(randomTile == TILE_FACTORY_J2):
                putCharInRandomCell(randomMap, TILE_FACTORY_J1)
            elif(randomTile == TILE_CITY_J1):
                putCharInRandomCell(randomMap, TILE_CITY_J2)
            elif(randomTile == TILE_CITY_J2):
                putCharInRandomCell(randomMap, TILE_CITY_J1)
            elif(randomTile == TILE_AIRPORT_J1):
                putCharInRandomCell(randomMap, TILE_AIRPORT_J2)
            elif(randomTile == TILE_AIRPORT_J2):
                putCharInRandomCell(randomMap, TILE_AIRPORT_J1)
            randomMap[i][j] = randomTile
    
    return randomMap

def generateTerms(map, mapTerms):
    nRoads = mapTerms["roads"]
    return generateRoads(map, nRoads)

def generateRoads(map, nRoads):
    for i in range(nRoads):
        cell = putCharInRandomCell(map, TILE_ROAD)
        if(cell == None):
            return False
        if(map[cell[0]][cell[1]] != TILE_ROAD):
            i -= 1
            continue
        putBuildingAsideACell(map, cell)
        mapWidth = len(map)
        mapHeigth = len(map[0])
        pathLength = random.randrange(1, int(min(mapWidth, mapHeigth)/2))
        adjacentCells = getAdjacentCells(map, cell[0], cell[1])
        availableCells = getAvailableCells(map, adjacentCells)
        if(len(availableCells) > 0):
            cellPath = availableCells[random.randrange(0, len(availableCells))]
            cellDifference = (cellPath[0] - cell[0], cellPath[1] - cell[1])
            while(cellPath[0] >= 0 and cellPath[0] < len(map) and cellPath[1] >= 0 and cellPath[1] < len(map[0]) and not tileIsNotGroundOrSea(map, cellPath[0], cellPath[1]) and pathLength > 0):
                map[cellPath[0]][cellPath[1]] = TILE_ROAD
                cellPath = (cellPath[0] + cellDifference[0], cellPath[1] + cellDifference[1])
                pathLength -= 1
            cellPath = (cellPath[0] - cellDifference[0], cellPath[1] - cellDifference[1])
            putBuildingAsideACell(map, cellPath)
    return True

def putBuildingAsideACell(map, cell, maxBuildingsAside = 1):
    availableCells = getAdjacentCells(map, cell[0], cell[1])
    adjacentCell = None
    fullCells = 0
    for cell in availableCells:
        if(map[cell[0]][cell[1]] != TILE_EMPTY):
            fullCells += 1
    if(fullCells < maxBuildingsAside):
        adjacentCell = availableCells[random.randrange(0, len(availableCells))]
        while(map[adjacentCell[0]][adjacentCell[1]] != TILE_EMPTY):
            adjacentCell = availableCells[random.randrange(0, len(availableCells))]
        cities = [TILE_CITY, TILE_AIRPORT, TILE_FACTORY]
        map[adjacentCell[0]][adjacentCell[1]] = cities[random.randrange(0, len(cities))]

def getAvailableCells(map, cellList):
    availableCells = []
    for cell in cellList:
        if(map[cell[0]][cell[1]] == TILE_EMPTY):
            availableCells.append(cell)
    return availableCells

def getAdjacentCells(map, row, col):
    availableCells = []
    if(row == 0):
        if(col == 0):
            availableCells.append((row, col + 1))
            availableCells.append((row + 1, col))
        elif(col == len(map[0]) - 1):
            availableCells.append((row, col - 1))
            availableCells.append((row + 1, col))
        else:
            availableCells.append((row, col - 1))
            availableCells.append((row + 1, col))
            availableCells.append((row, col + 1))
    elif(row == len(map) - 1):
        if(col == 0):
            availableCells.append((row, col + 1))
            availableCells.append((row - 1, col))
        elif(col == len(map[0]) - 1):
            availableCells.append((row, col - 1))
            availableCells.append((row - 1, col - 1))
        else:
            availableCells.append((row, col - 1))
            availableCells.append((row - 1, col))
            availableCells.append((row, col + 1))
    else:
        if(col == 0):
            availableCells.append((row + 1, col))
            availableCells.append((row, col + 1))
            availableCells.append((row - 1, col))
        elif(col == len(map[0]) - 1):
            availableCells.append((row + 1, col))
            availableCells.append((row, col - 1))
            availableCells.append((row - 1, col))
        else:
            availableCells.append((row + 1, col))
            availableCells.append((row, col + 1))
            availableCells.append((row - 1, col))
            availableCells.append((row, col - 1))
    return availableCells

def checkAvailableTiles(map, i, j):
    availableTiles = [TILE_GROUND, TILE_SEA, TILE_FOREST, TILE_MOUNTAINS,
            TILE_CITY, TILE_AIRPORT, TILE_FACTORY, TILE_FACTORY_J1, TILE_FACTORY_J2,
            TILE_AIRPORT_J1, TILE_AIRPORT_J2, TILE_CITY_J1, TILE_CITY_J2]

    availableTilesWeigths = [50, 50, 10, 10, 3, 3, 3, 1, 1, 1, 1, 1, 1]

    return (availableTiles, availableTilesWeigths)

def tileIsNotGroundOrSea(map, i, j):
    if(map[i][j] == None):
        return False
    if(map[i][j] in [TILE_FOREST, TILE_MOUNTAINS, TILE_ROAD, TILE_FACTORY, TILE_CITY, TILE_AIRPORT,
                     TILE_FACTORY_J1, TILE_CITY_J1, TILE_AIRPORT_J1, TILE_HQ_J1, 
                     TILE_FACTORY_J2, TILE_CITY_J2, TILE_AIRPORT_J2, TILE_HQ_J2]):
        return True
    return False

def mapIsValid(map):
    hqsJ1 = 0
    hqsJ2 = 0
    for row in map:
        for cell in row:
            if(cell == TILE_HQ_J1):
                hqsJ1 += 1
            elif(cell == TILE_HQ_J2):
                hqsJ2 += 1
    if(hqsJ1 != 1 or hqsJ2 != 1):
        return False
    advantage = 0
    for cell in map:
        if(cell == TILE_FACTORY_J1):
            advantage += 2
        elif(cell == TILE_FACTORY_J2):
            advantage -= 2
        elif(cell == TILE_CITY_J1):
            advantage += 1
        elif(cell == TILE_CITY_J2):
            advantage -= 1
        elif(cell == TILE_AIRPORT_J1):
            advantage += 3
        elif(cell == TILE_AIRPORT_J2):
            advantage -= 3
    if(advantage > 2 or advantage < -2):
        return False
    return True

def putCharInRandomCell(map, char):
    fullRows = len(map)
    for row in map:
        if(not TILE_EMPTY in row):
            fullRows -= 1
    if(fullRows == 0):
        return None
    row = random.randrange(0, len(map))
    col = random.randrange(0, len(map[0]))
    while(map[row][col] != TILE_EMPTY):
        row = random.randrange(0, len(map))
        col = random.randrange(0, len(map[0]))
    if(map[row][col] == TILE_EMPTY):
        map[row][col] = char
        return (row, col)
    else:
        return None
    

def generateTestMaps(mapWidth, mapHeight, nMaps):
    for i in range(nMaps):
        nRoads = random.randrange(0, maxRoads + 1)
        mapTerms = {"roads": nRoads}
        rmap = generateRandomMapWithTerms(mapWidth, mapHeight, mapTerms)
        while(rmap == None or not mapIsValid(rmap)):
            rmap = generateRandomMapWithTerms(mapWidth, mapHeight, mapTerms)
        saveMapToFile("mapas-prueba/" + str(mapWidth) + "x" + str(mapHeight) + "-map" + str(i + 1) + "-r" + str(nRoads) + ".txt", rmap)
