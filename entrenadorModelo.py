import os

from kerasUtil import trainModel

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

trainModel("modelos/model_1-10.keras")