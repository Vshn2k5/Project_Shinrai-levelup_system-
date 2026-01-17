import torch
import torch.nn as nn

class GesturePrimitiveEncoder(nn.Module):
    """
    Encodes the raw landmarks/primitives into a dense embedding.
    """
    def __init__(self, input_size, hidden_size):
        super(GesturePrimitiveEncoder, self).__init__()
        self.fc = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.BatchNorm1d(hidden_size),
            nn.ReLU(),
            nn.Dropout(0.2)
        )

    def forward(self, x):
        # x shape: (Batch, Seq_Len, Input_Size)
        # Flatten batch and seq for linear layer
        b, s, f = x.shape
        x = x.view(b * s, f)
        x = self.fc(x)
        # Reshape back
        x = x.view(b, s, -1)
        return x

class SignLanguageModel(nn.Module):
    """
    The main model using BiLSTM or Transformer.
    """
    def __init__(self, input_size, hidden_size, num_classes, num_layers=2):
        super(SignLanguageModel, self).__init__()

        self.encoder = GesturePrimitiveEncoder(input_size, hidden_size)

        self.lstm = nn.LSTM(
            input_size=hidden_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True
        )

        # BiLSTM output is 2 * hidden_size
        self.classifier = nn.Sequential(
            nn.Linear(hidden_size * 2, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, num_classes)
        )

    def forward(self, x):
        # x: (Batch, Seq_Len, Input_Size)

        # 1. Encode primitives
        x = self.encoder(x)

        # 2. Temporal modeling
        # out: (Batch, Seq_Len, 2*Hidden)
        # hn: (Num_Layers*2, Batch, Hidden)
        lstm_out, (hn, cn) = self.lstm(x)

        # 3. Classification
        # We take the output of the last time step
        last_out = lstm_out[:, -1, :]

        logits = self.classifier(last_out)
        return logits
