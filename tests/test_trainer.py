import unittest
import torch
import numpy as np
import shutil
import os
from src.trainer import Trainer
from src.dataset_manager import DatasetManager
from src.config import SEMANTIC_TOKENS, INPUT_SIZE, MODELS_DIR

class TestTrainer(unittest.TestCase):
    def setUp(self):
        self.test_data_dir = 'data/test_trainer_data'
        self.manager = DatasetManager(base_dir=self.test_data_dir)
        self.trainer = Trainer(data_dir=self.test_data_dir)

        # Create some dummy data
        for _ in range(5):
            self.manager.save_sample('English', SEMANTIC_TOKENS[0], np.random.rand(30, INPUT_SIZE), {})
            self.manager.save_sample('English', SEMANTIC_TOKENS[1], np.random.rand(30, INPUT_SIZE), {})

    def tearDown(self):
        if os.path.exists(self.test_data_dir):
            shutil.rmtree(self.test_data_dir)

        # Clean up model
        model_path = os.path.join(MODELS_DIR, 'best_model.pth')
        if os.path.exists(model_path):
            os.remove(model_path)

    def test_train_loop(self):
        result = self.trainer.train(epochs=1)
        self.assertEqual(result['status'], 'success')
        self.assertTrue(os.path.exists(os.path.join(MODELS_DIR, 'best_model.pth')))

    def test_load_model(self):
        self.trainer.train(epochs=1)
        model = self.trainer.load_model()
        self.assertIsNotNone(model)

if __name__ == '__main__':
    unittest.main()
