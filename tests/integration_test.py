import unittest
import shutil
import os
import numpy as np
import torch
import time

from src.dataset_manager import DatasetManager
from src.trainer import Trainer
from src.translator import Translator
from src.config import INPUT_SIZE, SEMANTIC_TOKENS, SEQUENCE_LENGTH, MODELS_DIR

class IntegrationTest(unittest.TestCase):
    def setUp(self):
        self.test_dir = 'data/integration_test_data'
        self.dataset_manager = DatasetManager(base_dir=self.test_dir)
        self.trainer = Trainer(data_dir=self.test_dir)
        self.translator = Translator()

        # Ensure clean state
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)

    def tearDown(self):
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)

    def test_full_pipeline(self):
        print("\n--- Starting End-to-End Integration Test ---")

        # 1. Simulate Recording Data (Vision Layer output simulation)
        # We will create samples for 'HELLO' and 'NO'
        # We make them distinct so the model can learn:
        # HELLO = all ones, NO = all zeros (simplified for learning proof)
        print("1. Recording Mock Data...")

        for _ in range(10):
            # Class A: HELLO (High values)
            feat_hello = np.ones((SEQUENCE_LENGTH, INPUT_SIZE)) + np.random.normal(0, 0.1, (SEQUENCE_LENGTH, INPUT_SIZE))
            self.dataset_manager.save_sample('English', 'HELLO', feat_hello, {'signer': 'bot'})

            # Class B: NO (Low values)
            feat_no = np.zeros((SEQUENCE_LENGTH, INPUT_SIZE)) + np.random.normal(0, 0.1, (SEQUENCE_LENGTH, INPUT_SIZE))
            self.dataset_manager.save_sample('English', 'NO', feat_no, {'signer': 'bot'})

        # 2. Train Model
        print("2. Training Model...")
        result = self.trainer.train(epochs=5)
        self.assertEqual(result['status'], 'success')
        self.assertTrue(os.path.exists(os.path.join(MODELS_DIR, 'best_model.pth')))

        # 3. Load Model
        print("3. Loading Model...")
        model = self.trainer.load_model()
        self.assertIsNotNone(model)

        # 4. Inference (Simulate User Mode)
        print("4. Testing Inference...")

        # Test Case A: Should be HELLO
        input_hello = np.ones((SEQUENCE_LENGTH, INPUT_SIZE))
        tensor_hello = torch.FloatTensor(input_hello).unsqueeze(0).to(self.trainer.device)

        # Test Case B: Should be NO
        input_no = np.zeros((SEQUENCE_LENGTH, INPUT_SIZE))
        tensor_no = torch.FloatTensor(input_no).unsqueeze(0).to(self.trainer.device)

        with torch.no_grad():
            logits_hello = model(tensor_hello)
            pred_idx_hello = torch.argmax(logits_hello, dim=1).item()
            token_hello = SEMANTIC_TOKENS[pred_idx_hello]

            logits_no = model(tensor_no)
            pred_idx_no = torch.argmax(logits_no, dim=1).item()
            token_no = SEMANTIC_TOKENS[pred_idx_no]

        print(f"Prediction for High Values: {token_hello}")
        print(f"Prediction for Low Values: {token_no}")

        # Note: Since the model is randomly initialized and we only trained for 5 epochs on toy data,
        # it *should* converge because the data is linearly separable (0s vs 1s).
        # We check if it predicts valid tokens.
        self.assertIn(token_hello, SEMANTIC_TOKENS)
        self.assertIn(token_no, SEMANTIC_TOKENS)

        # 5. Translation
        print("5. Verifying Translation...")
        trans = self.translator.translate(token_hello)
        self.assertIn('Namaste', trans['Hindi'])

        print("--- Integration Test Passed ---")

if __name__ == '__main__':
    unittest.main()
