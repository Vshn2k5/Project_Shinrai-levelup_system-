import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
import os
from src.dataset_manager import DatasetManager
from src.model import SignLanguageModel
from src.config import INPUT_SIZE, HIDDEN_SIZE, NUM_CLASSES, LEARNING_RATE, BATCH_SIZE, EPOCHS, MODELS_DIR, SEMANTIC_TOKENS, SEQUENCE_LENGTH

class SignDataset(Dataset):
    def __init__(self, features, labels, token_map):
        self.features = features
        self.labels = labels
        self.token_map = token_map

    def __len__(self):
        return len(self.features)

    def __getitem__(self, idx):
        x = self.features[idx]
        y_str = self.labels[idx]
        y = self.token_map[y_str]

        # Pad or truncate sequence to fixed length
        if x.shape[0] < SEQUENCE_LENGTH:
            # Pad with zeros
            pad = np.zeros((SEQUENCE_LENGTH - x.shape[0], x.shape[1]))
            x = np.vstack((x, pad))
        elif x.shape[0] > SEQUENCE_LENGTH:
            # Truncate
            x = x[:SEQUENCE_LENGTH, :]

        return torch.FloatTensor(x), torch.tensor(y, dtype=torch.long)

class Trainer:
    def __init__(self, data_dir=None):
        self.manager = DatasetManager(base_dir=data_dir) if data_dir else DatasetManager()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.token_map = {token: i for i, token in enumerate(SEMANTIC_TOKENS)}

    def train(self, epochs=EPOCHS):
        X, y_raw, _ = self.manager.load_dataset()

        if not X:
            print("No data found to train on.")
            return {"status": "error", "message": "No data found"}

        # Filter out labels that are not in SEMANTIC_TOKENS (just in case)
        X_filtered = []
        y_filtered = []
        for feat, label in zip(X, y_raw):
            if label in self.token_map:
                X_filtered.append(feat)
                y_filtered.append(label)

        if not X_filtered:
             return {"status": "error", "message": "No valid data matching defined tokens"}

        dataset = SignDataset(X_filtered, y_filtered, self.token_map)
        dataloader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

        model = SignLanguageModel(INPUT_SIZE, HIDDEN_SIZE, NUM_CLASSES)
        model.to(self.device)

        criterion = nn.CrossEntropyLoss()
        optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

        best_loss = float('inf')

        for epoch in range(epochs):
            model.train()
            total_loss = 0
            for X_batch, y_batch in dataloader:
                X_batch, y_batch = X_batch.to(self.device), y_batch.to(self.device)

                optimizer.zero_grad()
                outputs = model(X_batch)
                loss = criterion(outputs, y_batch)
                loss.backward()
                optimizer.step()

                total_loss += loss.item()

            avg_loss = total_loss / len(dataloader)
            print(f"Epoch {epoch+1}/{epochs}, Loss: {avg_loss:.4f}")

            # Save best model
            if avg_loss < best_loss:
                best_loss = avg_loss
                torch.save(model.state_dict(), os.path.join(MODELS_DIR, 'best_model.pth'))

        return {"status": "success", "final_loss": best_loss}

    def load_model(self):
        model_path = os.path.join(MODELS_DIR, 'best_model.pth')
        if not os.path.exists(model_path):
            return None

        model = SignLanguageModel(INPUT_SIZE, HIDDEN_SIZE, NUM_CLASSES)
        model.load_state_dict(torch.load(model_path, map_location=self.device))
        model.to(self.device)
        model.eval()
        return model
