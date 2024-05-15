import os

tiles = ["#", ".", "?", "^", "=", "+", "$", "&", "e", "i", "a", "o", "E", "I", "A", "O"]

def ls(path = os.getcwd()):
    return [arch.name for arch in os.scandir(path) if arch.is_file()]

def readFile(filePath):
    file = open(filePath, 'r')
    fileContent = file.read()
    file.close()
    return fileContent

def saveMapToFile(nameFile, map):
    file = open(nameFile, "w")
    for i in range(len(map)):
        for j in range(len(map[0])):
            file.write(map[i][j])
        file.write("\n")
    file.close()