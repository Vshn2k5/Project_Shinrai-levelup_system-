import os
import json
import numpy as np
import uuid
from datetime import datetime
from src.config import RAW_DATA_DIR, PROCESSED_DATA_DIR

class DatasetManager:
    def __init__(self, base_dir=RAW_DATA_DIR):
        self.base_dir = base_dir

    def create_sample_structure(self, language, token):
        """
        Creates the directory structure for a new sample.
        Returns the sample_id and the directory path.
        """
        sample_id = str(uuid.uuid4())[:8]
        # Structure: data/raw/Language/Token/SampleID/
        sample_dir = os.path.join(self.base_dir, language, token, sample_id)
        os.makedirs(sample_dir, exist_ok=True)
        return sample_id, sample_dir

    def save_sample(self, language, token, features, metadata):
        """
        Saves the recorded gesture sample.
        features: List or Numpy array of shape (Seq_Len, Input_Size)
        metadata: Dictionary containing additional info
        """
        sample_id, sample_dir = self.create_sample_structure(language, token)

        # Save Features
        features_path = os.path.join(sample_dir, 'features.npy')
        np.save(features_path, np.array(features))

        # Update Metadata
        metadata.update({
            'id': sample_id,
            'language': language,
            'token': token,
            'timestamp': datetime.now().isoformat(),
            'shape': np.array(features).shape
        })

        # Save Metadata
        meta_path = os.path.join(sample_dir, 'metadata.json')
        with open(meta_path, 'w') as f:
            json.dump(metadata, f, indent=4)

        return sample_id

    def load_dataset(self):
        """
        Loads all samples from the dataset directory.
        Returns:
            X: List of numpy arrays (sequences)
            y: List of labels (tokens)
            paths: List of file paths (for debugging)
        """
        X = []
        y = []
        paths = []

        # Walk through the directory
        # Expected: base_dir / Language / Token / SampleID
        if not os.path.exists(self.base_dir):
            return [], [], []

        for language in os.listdir(self.base_dir):
            lang_path = os.path.join(self.base_dir, language)
            if not os.path.isdir(lang_path): continue

            for token in os.listdir(lang_path):
                token_path = os.path.join(lang_path, token)
                if not os.path.isdir(token_path): continue

                for sample_id in os.listdir(token_path):
                    sample_path = os.path.join(token_path, sample_id)
                    features_file = os.path.join(sample_path, 'features.npy')

                    if os.path.exists(features_file):
                        try:
                            features = np.load(features_file)
                            X.append(features)
                            y.append(token)
                            paths.append(sample_path)
                        except Exception as e:
                            print(f"Error loading {sample_path}: {e}")

        return X, y, paths

    def get_stats(self):
        """
        Returns statistics about the dataset.
        """
        stats = {}
        if not os.path.exists(self.base_dir):
            return stats

        for language in os.listdir(self.base_dir):
            lang_path = os.path.join(self.base_dir, language)
            if not os.path.isdir(lang_path): continue

            stats[language] = {}
            for token in os.listdir(lang_path):
                token_path = os.path.join(lang_path, token)
                if not os.path.isdir(token_path): continue

                count = len(os.listdir(token_path))
                stats[language][token] = count

        return stats
