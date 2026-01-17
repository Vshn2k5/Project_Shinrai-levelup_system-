# Unified Multilingual Sign Gesture Understanding System

## Overview
A research-grade system that recognizes sign gestures, decomposes them into motion primitives, and translates them into multiple spoken languages (English, Hindi, Malayalam, Japanese). Ideally suited for a final year capstone project, this system features a novel "Gesture Primitive" architecture and a built-in "Admin Data Studio" for creating custom datasets.

## Features
- **Multilingual Translation**: Maps gestures to English, Hindi, Malayalam, and Japanese.
- **Gesture Primitives**: Uses MediaPipe to extract robust geometric features.
- **Admin Studio**: Integrated interface to record, label, and train on your own gestures.
- **Real-Time Inference**: Lightweight BiLSTM model running on CPU.
- **Privacy First**: Processes landmarks locally; no video is stored (unless explicitly recorded for training).

## Prerequisites
- Python 3.8+
- Webcam

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. **Create a Virtual Environment** (Recommended)
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   *Note: This project uses `mediapipe==0.10.14` specifically. Do not upgrade to the latest version as it breaks the API used.*

## Running the Application

To start the system, run the Streamlit application:

```bash
streamlit run app.py
```

## User Guide

### 1. Admin Mode (First Step)
*Since the system starts with no data, you must teach it some signs first.*
1. Go to the sidebar and select **"Admin Mode (Data & Training)"**.
2. Go to the **"Record New Gestures"** tab.
3. Select a Language Context (e.g., English) and a Semantic Token (e.g., `HELLO`).
4. Enter your name in "Signer ID".
5. Click **"Start Recording"** and perform the sign 5 times in front of the camera.
6. Repeat this for at least one other token (e.g., `NO`) so the model has classes to distinguish.
7. Go to the **"Train Model"** tab.
8. Click **"Train Model"**. Wait for the success message.

### 2. User Mode (Recognition)
1. Go to the sidebar and select **"User Mode (Recognition)"**.
2. Check the **"Start Camera"** box.
3. Perform the signs you trained.
4. See the real-time translation in 4 languages on the right panel.

## Project Structure
- `src/`: Core source code (Vision, Model, Dataset, Trainer).
- `data/`: Stores recorded gestures (raw numpy arrays) and metadata.
- `models/`: Stores the trained PyTorch model (`best_model.pth`).
- `reports/`: Documentation (Report, Slides Outline, Viva Q&A).
- `tests/`: Unit and integration tests.

## Troubleshooting
- **"AttributeError: module 'mediapipe' has no attribute 'solutions'"**: Ensure you installed the correct version from `requirements.txt` (`pip install mediapipe==0.10.14`).
- **Webcam not working**: Ensure no other application is using the camera. On Linux, you might need to install `v4l-utils`.
