import cv2
import mediapipe as mp
import numpy as np

class VisionProcessor:
    def __init__(self):
        self.mp_holistic = mp.solutions.holistic
        self.holistic = self.mp_holistic.Holistic(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def process_frame(self, frame):
        """
        Process a single frame and return landmarks.
        Input: frame (numpy array, BGR)
        Output: results object from mediapipe
        """
        # MediaPipe expects RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = self.holistic.process(image)
        image.flags.writeable = True
        return results

    def extract_landmarks(self, results):
        """
        Convert results to a flattened numpy array.
        Order: Pose (33*4), Left Hand (21*3), Right Hand (21*3)
        Total: 132 + 63 + 63 = 258
        """
        # Pose: 33 landmarks, x, y, z, visibility
        if results.pose_landmarks:
            pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten()
        else:
            pose = np.zeros(33 * 4)

        # Left Hand: 21 landmarks, x, y, z
        if results.left_hand_landmarks:
            lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten()
        else:
            lh = np.zeros(21 * 3)

        # Right Hand: 21 landmarks, x, y, z
        if results.right_hand_landmarks:
            rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten()
        else:
            rh = np.zeros(21 * 3)

        return np.concatenate([pose, lh, rh])

    def extract_primitives(self, landmarks):
        """
        Extract simplified gesture primitives for analysis.
        This is a placeholder for the more complex geometric calculations
        required for the "Primitive" layer.
        For the MVP model input, we use the raw landmarks, but this function
        can return specific features for the UI or advanced models.
        """
        # Example: Calculate if hands are raised (wrist y < nose y)
        # We need to map the flat array back to structured data to do this easily.
        # But for now, we simply return the raw landmarks as the primary feature vector.
        return landmarks
