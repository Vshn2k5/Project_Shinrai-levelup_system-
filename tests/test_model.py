import unittest
import torch
from src.model import SignLanguageModel
from src.config import INPUT_SIZE, HIDDEN_SIZE, NUM_CLASSES, SEQUENCE_LENGTH

class TestModel(unittest.TestCase):
    def test_model_forward(self):
        batch_size = 4
        # Create dummy input: (Batch, Seq_Len, Input_Size)
        dummy_input = torch.randn(batch_size, SEQUENCE_LENGTH, INPUT_SIZE)

        model = SignLanguageModel(INPUT_SIZE, HIDDEN_SIZE, NUM_CLASSES)

        output = model(dummy_input)

        # Check output shape: (Batch, Num_Classes)
        self.assertEqual(output.shape, (batch_size, NUM_CLASSES))

if __name__ == '__main__':
    unittest.main()
