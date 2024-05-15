import random

#defined in evaluadorMapas.py
from kerasUtil import prepareModel, evaluateMap

#defined in generadorMapasRandom.py
from generadorMapasRandom import generateRandomMap

modelPath = "modelos/model_1-09.keras"

n_iter = 100
populationInitial = 100
percentageSelection = 0.5
percentageBest = 0.2
probMutate = 0.1

tiles = ["#", ".", "?", "^", "=", "+", "$", "&", "e", "i", "a", "o", "E", "I", "A", "O"]

attemptsToGenerateMap = 1000

def generateMap(mapWidth, mapHeight, features=None):
    model = prepareModel(modelPath)
    population = generatePopulation(populationInitial, mapWidth, mapHeight)
    bestHabitants = population
    for i in range(n_iter):
        population = reproduce(bestHabitants, populationInitial)
        population = mutate(population, probMutate)
        bestHabitants = selectBest(population, percentageSelection, percentageBest, model, features)
        return bestHabitants[0]

def generatePopulation(numberOfHabitants, mapWidth, mapHeight):
    population = []
    attempts = 0
    for i in range(numberOfHabitants):
        map = generateRandomMap(mapWidth, mapHeight)
        while(map == None):
            if(attempts == attemptsToGenerateMap):
                raise Exception("No se pudo generar el mapa")
            attempts += 1
            map = generateRandomMap(mapWidth, mapHeight)
        population.append(map)
        attempts = 0
    return population

def selectBest(population, percentageSelection, percentageBest, model, features=None):
    populationSorted = sorted(population, key=lambda x: fitnessFunction(x, model, features), reverse=True)
    habitantsToSelect = int(percentageSelection * len(populationSorted))
    bestHabitantsToSelect = int(percentageBest * len(populationSorted))
    newPopulation = []
    for i in range(bestHabitantsToSelect):
        newPopulation.append(populationSorted[i])
        populationSorted.pop(0)
    for i in range(habitantsToSelect - bestHabitantsToSelect):
        randMapIndex = random.randrange(len(populationSorted))
        randMap = populationSorted[randMapIndex]
        populationSorted.pop(randMapIndex)
        newPopulation.append(randMap)
    return newPopulation

def fitnessFunction(map, model, features=None):
    params = 0
    evaluationMap = evaluateMap(map, model)[0]
    # Simetría
    symmetryFitness = calculateSymmetryFitness(map)
    params += 1
    # Características
    roadsFitness = 0
    if(features != None):
        roadsFitness = max(0, 1 - abs(features["roads"] - evaluationMap) / features["roads"])
        params += 1
    # Cuarteles generales
    hqsFitness = calculateHQsFitness(map)
    params += 1
    return (symmetryFitness + roadsFitness + hqsFitness) / params

def calculateSymmetryFitness(arrayMap):
    numberOfRows = len(arrayMap)
    numberOfColumns = len(arrayMap[0])
    
    # Calcular la diferencia entre elementos opuestos
    penalty = 0
    nElements = 0
    for i in range(numberOfRows):
        for j in range(numberOfColumns):
            # Verificar simetría horizontal
            if j < numberOfColumns - 1 - j:
                if arrayMap[i][j] != arrayMap[i][numberOfColumns - 1 - j]:
                    penalty += 1
                nElements += 1
            # Verificar simetría vertical
            if i < numberOfRows - 1 - i:
                if arrayMap[i][j] != arrayMap[numberOfRows - 1 - i][j]:
                    penalty += 1
                nElements += 1
    
    # Calcular la simetría
    if nElements == 0:
        return 1.0  # Si la matriz está vacía, devuelve simetría perfecta
    else:
        symmetry = 1 - (penalty / nElements)
        return symmetry

def calculateHQsFitness(map):
    nHQj1 = 0
    nHQj2 = 0
    for i in range(len(map)):
        for j in range(len(map[i])):
            if(map[i][j] == "o"):
                nHQj1 += 1
            elif(map[i][j] == "O"):
                nHQj2 += 1
    if(nHQj1 != 1 or nHQj2 != 1):
        return 0
    else:
        return 1

def reproduce(population, habitantsToGet):
    copyPopulation = population
    while (len(population) < habitantsToGet):
        randMapIndex = random.randrange(len(copyPopulation))
        randMap = copyPopulation[randMapIndex]
        copyPopulation.pop(randMapIndex)
        randMapIndex2 = random.randrange(len(copyPopulation))
        randMap2 = copyPopulation[randMapIndex2]
        copyPopulation.pop(randMapIndex2)
        population.append(createSon(randMap, randMap2))
    return population

def createSon(map1, map2):
    fitnessMap1 = fitnessFunction(map1)
    fitnessMap2 = fitnessFunction(map2)
    prob = fitnessMap1/(fitnessMap1 + fitnessMap2)
    mask = generateMask(prob, len(map1[0]), len(map1))
    son = []
    row = []
    for i in range(len(map1)):
        for j in range(len(map1[0])):
            if(mask[i][j] == 1):
                row.append(map1[i][j])
            else:
                row.append(map2[i][j])
        mask.append(row)
        row = []
    return son

def generateMask(probability, mapWidth, mapHeight):
    mask = []
    numberOfTiles = mapHeight * mapWidth
    tilesSon1 = numberOfTiles * probability
    tilesSon2 = numberOfTiles - tilesSon1
    for i in range(numberOfTiles):
        row = []
        randInt = random.random()
        if(randInt < 0.5 & tilesSon1 > 0):
            row.append(1)
            tilesSon1 -= 1
        else:
            row.append(0)
            tilesSon2 -= 1
        if(i % mapWidth == 0):
            mask.append(row)
            row = []

def mutate(population, probMutate):
    for j in range(len(population)):
        rand = random.random()
        if(rand < probMutate):
            population[j] = mutateMap(population[j])
    return population

def mutateMap(map):
    row = random.randrange(len(map))
    col = random.randrange(len(map[0]))
    randTile = map[row][col]
    randSymbol = tiles[random.randrange(len(tiles))]
    while (randSymbol != randTile):
        randSymbol = tiles[random.randrange(len(tiles))]
    map[row][col] = randSymbol
    return map
