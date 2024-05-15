import tensorflow as tf
import matplotlib.pyplot as plt
from fileUtil import ls, readFile

tiles = ["#", ".", "?", "^", "+", "$", "&", "e", "i", "a", "o", "E", "I", "A", "O", "="]

MAX_MAP_SIZE = 100

def getMapFromString(mapString):
    mapArray = []
    mapRow = []
    for c in mapString:
        if(c == '\n'):
            mapArray.append(mapRow)
            mapRow = []
        else:
            mapRow.append(c)
    return mapArray

def getNumberArrayFromMap(map):
    mapArray = []
    mapRow = []
    for i in range(len(map)):
        mapRow = []
        for j in range(len(map[i])):
            if(map[i][j] == "="):
                mapRow.append(1)
            else:
                mapRow.append(0)
        mapArray.append(mapRow)
    return mapArray

def adaptMap(map):
    adaptedMap = []
    for i in range(MAX_MAP_SIZE):
        row = []
        for j in range(MAX_MAP_SIZE):
            if(i < len(map) and j < len(map[i])):
                row.append(map[i][j])
            else:
                row.append(0)
        adaptedMap.append(row)
    return adaptedMap

def getTestData(dirPath):
    filesNames = ls(dirPath)
    values_training_input = []
    values_training_output = []
    for fileName in filesNames:
        filePath = dirPath + fileName
        fileContent = readFile(filePath)
        mapArray = getNumberArrayFromMap(getMapFromString(fileContent))
        values_training_input.append(mapArray)
        values_training_output.append(int(fileName[fileName.index("r") + 1]))
    return [values_training_input, values_training_output]

def loadModel(pathLoadedModel):
    if(pathLoadedModel == None):
        return createModel((MAX_MAP_SIZE, MAX_MAP_SIZE, 1))
    else:
        try: 
            return tf.keras.models.load_model(pathLoadedModel)
        except OSError as error: 
            return createModel((MAX_MAP_SIZE, MAX_MAP_SIZE, 1))

def prepareModel(pathLoadedModel):
    model = loadModel(pathLoadedModel)
    #Ajustar el Learning rate
    #custom_optimizer = tf.keras.optimizers.SGD(learning_rate=1e-4)
    model.compile(optimizer='adam', loss='mean_squared_error', metrics=['accuracy'])
    #compiler: sgd, adam
    return model

def createModel(input_shape):
    model = tf.keras.Sequential([
        # Capas convolucionales
        tf.keras.layers.Conv2D(filters=64, kernel_size=(5, 5), strides=(1, 1), padding="valid", activation='relu', input_shape=input_shape),
        tf.keras.layers.MaxPooling2D(pool_size=(3, 3), strides=(2, 2), padding='valid'),
        tf.keras.layers.Normalization(),
        tf.keras.layers.Conv2D(filters=64, kernel_size=(5, 5), strides=(1, 1), padding="valid", activation='relu'),
        tf.keras.layers.Normalization(),
        tf.keras.layers.MaxPooling2D(pool_size=(3, 3), strides=(1, 1), padding='valid'),
        tf.keras.layers.Conv2D(filters=64, kernel_size=(5, 5), strides=(1, 1), padding="valid", activation='relu'),
        tf.keras.layers.MaxPooling2D(pool_size=(3, 3), strides=(2, 2), padding='valid'),
        tf.keras.layers.Normalization(),
        tf.keras.layers.Conv2D(filters=64, kernel_size=(5, 5), strides=(1, 1), padding="valid", activation='relu'),
        tf.keras.layers.Normalization(),
        tf.keras.layers.Flatten(),
        # Capas completamente conectadas
        tf.keras.layers.Dense(256, activation='relu'),
        tf.keras.layers.Dense(1)  # Capa de salida con una sola neurona para la regresión
    ])
    #activation: linear, relu, softmax, sigmoid
    #padding: valid, same
    model.summary()
    return model

def trainModel(pathLoadedModel):
    values_training_input, values_training_output = getTestData("mapas-prueba/")
    values_training_input_adapted = []
    for i in range(len(values_training_input)):
        values_training_input_adapted.append(adaptMap(values_training_input[i]))
    # Convertir los datos a NumPy arrays
    x_train = tf.convert_to_tensor(values_training_input_adapted, dtype=tf.int32)
    y_train = tf.convert_to_tensor(values_training_output, dtype=tf.int32)

    # Dividir los datos en conjuntos de entrenamiento, validación y test
    split_ratio_val = 0.8
    split_ratio_test = 0.1
    split_index_val = int(len(values_training_input_adapted) * split_ratio_val)
    split_index_test = int(len(values_training_input_adapted) * (split_ratio_val + split_ratio_test))

    x_train_fit, x_test_data = x_train[:split_index_test], x_train[split_index_test:]
    y_train_fit, y_test_data = y_train[:split_index_test], y_train[split_index_test:]

    x_train_data, x_val_data = x_train_fit[:split_index_val], x_train_fit[split_index_val:]
    y_train_data, y_val_data = y_train_fit[:split_index_val], y_train_fit[split_index_val:]


    # Model
    model = prepareModel(pathLoadedModel)

    # Entrenar el modelo
    epochs = 50
    history = model.fit(
        x_train_fit, y_train_fit, 
        validation_data=(x_val_data, y_val_data), 
        epochs=epochs)

    # Opcional, visualizar los datos del entrenamiento ----------------------------------------------------
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']

    loss = history.history['loss']
    val_loss = history.history['val_loss']

    epochs_range = range(epochs)
    plt.figure(figsize=(8, 8))
    plt.subplot(1, 2, 1)
    plt.plot(epochs_range, acc, label='Training Accuracy')
    plt.plot(epochs_range, val_acc, label='Validation Accuracy')
    plt.legend(loc='lower right')
    plt.title('Training and Validation Accuracy')

    plt.subplot(1, 2, 2)
    plt.plot(epochs_range, loss, label='Training Loss')
    plt.plot(epochs_range, val_loss, label='Validation Loss')
    plt.legend(loc='upper right')
    plt.title('Training and Validation Loss')
    plt.show()

    # Prueba con otros valores  ----------------------------------------------------
    loss = model.evaluate(x_train, y_train)
    print(f'Loss: {loss}')

    if(pathLoadedModel != None):
        model.save(pathLoadedModel)

    # Predecir con nuevos datos
    predictions = model.predict(tf.convert_to_tensor(x_test_data, dtype=tf.int32))
    print(f'Predictions: {predictions.flatten()}')
    print(f'Expected: {y_test_data}')

def evaluateMap(mapToEvaluate, model):
    predictions = model.predict(tf.convert_to_tensor([adaptMap(getNumberArrayFromMap(mapToEvaluate))], dtype=tf.int32))
    return predictions.flatten()