import unittest
import numpy as np
import cv2
from src.vision_processor import VisionProcessor

class TestVisionProcessor(unittest.TestCase):
    def setUp(self):
        self.processor = VisionProcessor()

    def test_process_frame_black_image(self):
        # Create a black image
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        results = self.processor.process_frame(frame)
        self.assertIsNotNone(results)

        # Extract landmarks
        landmarks = self.processor.extract_landmarks(results)

        # Check shape
        # Pose (132) + LH (63) + RH (63) = 258
        self.assertEqual(landmarks.shape[0], 258)

        # Since image is black, landmarks might be all zeros or close to it
        # depending on MediaPipe behavior (it usually returns None for missing landmarks,
        # which our code handles by returning zeros)
        self.assertTrue(np.all(landmarks == 0))

if __name__ == '__main__':
    unittest.main()
