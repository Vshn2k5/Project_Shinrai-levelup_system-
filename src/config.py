import os

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
RAW_DATA_DIR = os.path.join(DATA_DIR, 'raw')
PROCESSED_DATA_DIR = os.path.join(DATA_DIR, 'processed')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Ensure directories exist
os.makedirs(RAW_DATA_DIR, exist_ok=True)
os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

# System Constants
LANGUAGES = ['English', 'Hindi', 'Malayalam', 'Japanese']

# The core semantic tokens the system will learn
SEMANTIC_TOKENS = [
    'HELLO',
    'THANK_YOU',
    'YES',
    'NO',
    'HELP',
    'PLEASE',
    'GOODBYE',
    'SORRY',
    'EAT',
    'DRINK'
]

# Model Hyperparameters
SEQUENCE_LENGTH = 30  # Number of frames per gesture
# Input size depends on the features extracted.
# Left Hand (21*3) + Right Hand (21*3) + Pose (33*4) = 63 + 63 + 132 = 258
# Plus primitives (angles, velocity) could increase this.
# We will set this dynamically or fix it after vision_processor implementation.
# For now, let's assume we use full landmarks + minimal primitives.
INPUT_SIZE = 258
HIDDEN_SIZE = 128
NUM_LAYERS = 2
NUM_CLASSES = len(SEMANTIC_TOKENS)
LEARNING_RATE = 0.001
BATCH_SIZE = 4
EPOCHS = 20
