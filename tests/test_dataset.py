import unittest
import shutil
import os
import numpy as np
from src.dataset_manager import DatasetManager

class TestDatasetManager(unittest.TestCase):
    def setUp(self):
        self.test_dir = 'data/test_raw'
        self.manager = DatasetManager(base_dir=self.test_dir)

    def tearDown(self):
        # Clean up created directories
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)

    def test_save_and_load_sample(self):
        # Create dummy data
        features = np.random.rand(30, 258)
        metadata = {'signer': 'Tester'}

        # Save
        sample_id = self.manager.save_sample('English', 'HELLO', features, metadata)

        # Verify file exists
        expected_path = os.path.join(self.test_dir, 'English', 'HELLO', sample_id, 'features.npy')
        self.assertTrue(os.path.exists(expected_path))

        # Load
        X, y, paths = self.manager.load_dataset()

        # Verify
        self.assertEqual(len(X), 1)
        self.assertEqual(y[0], 'HELLO')
        self.assertEqual(X[0].shape, (30, 258))

    def test_get_stats(self):
        self.manager.save_sample('English', 'HELLO', np.random.rand(10, 10), {})
        self.manager.save_sample('English', 'HELLO', np.random.rand(10, 10), {})
        self.manager.save_sample('English', 'BYE', np.random.rand(10, 10), {})

        stats = self.manager.get_stats()
        self.assertEqual(stats['English']['HELLO'], 2)
        self.assertEqual(stats['English']['BYE'], 1)

if __name__ == '__main__':
    unittest.main()
