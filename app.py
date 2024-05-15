from flask import Flask, request, jsonify, render_template, redirect, url_for

from generadorMapasGenetico import generateMap

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_aw_map', methods=['POST'])
def generateAWMap():
    mapWidthStr = request.form['mapWidth']
    mapHeightStr = request.form['mapHeight']
    nRoadsStr = request.form['numberRoads']
    try:
        mapWidth = int(mapWidthStr)
        mapHeight = int(mapHeightStr)
        nRoads = int(nRoadsStr)
        if(mapWidth >= 10 and mapWidth <= 100 and mapHeight >= 10 and mapHeight <= 100 and nRoads >= 0 and nRoads <= 10):
            features = {"roads": nRoads}
            map = generateMap(mapWidth, mapHeight, features)
            return redirect(url_for('loadGame', response=convertArrayMapToString(map)))
        else:
            return render_template('index.html', errorMsg="Un parámetro tiene un valor incorrecto.")
    except:
        return render_template('index.html', errorMsg="No se pudo generar el mapa. Inténtelo de nuevo.")

@app.route('/game')
def loadGame():
    response = request.args.get('response')
    return render_template('game/game.html', response=response)

def convertArrayMapToString(map):
    mapStr = ""
    for i in range(len(map)):
        for j in range(len(map[i])):
            mapStr += map[i][j]
        mapStr += "\n"
    return mapStr

if __name__ == '__main__':
    app.run(debug=True)