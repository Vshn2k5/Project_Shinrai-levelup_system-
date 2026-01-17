import streamlit as st
import cv2
import numpy as np
import time
import torch
import os
from PIL import Image

# Import our modules
from src.config import SEMANTIC_TOKENS, LANGUAGES, SEQUENCE_LENGTH, MODELS_DIR
from src.vision_processor import VisionProcessor
from src.dataset_manager import DatasetManager
from src.trainer import Trainer
from src.translator import Translator
from src.model import SignLanguageModel

# Initialize modules
vision_processor = VisionProcessor()
dataset_manager = DatasetManager()
trainer = Trainer()
translator = Translator()

st.set_page_config(page_title="Multilingual Sign Gesture System", layout="wide")

st.title("Unified Multilingual Sign Gesture Understanding System")
st.sidebar.title("Navigation")
mode = st.sidebar.radio("Go to", ["User Mode (Recognition)", "Admin Mode (Data & Training)"])

# ==========================================
# USER MODE: RECOGNITION
# ==========================================
if mode == "User Mode (Recognition)":
    st.header("Real-Time Sign Language Recognition")

    col1, col2 = st.columns([2, 1])

    with col1:
        st.write("Webcam Feed (Simulated for this environment)")
        run_recognition = st.checkbox("Start Camera")
        image_placeholder = st.empty()

    with col2:
        st.subheader("Translation")
        token_display = st.empty()
        st.markdown("---")
        eng_display = st.empty()
        hin_display = st.empty()
        mal_display = st.empty()
        jap_display = st.empty()

    if run_recognition:
        # Load Model
        model = trainer.load_model()
        if model is None:
            st.error("No trained model found! Please go to Admin Mode and train the model first.")
        else:
            cap = cv2.VideoCapture(0) # In local env this works. Here it might fail or return black.

            sequence = []

            # If camera not available, we can't really do much in Streamlit without webrtc component
            # but standard cv2 is used for local prototypes.
            if not cap.isOpened():
                st.warning("Camera not detected. Using dummy black frames for demo.")

            stop_button = st.button("Stop")

            while not stop_button:
                if cap.isOpened():
                    ret, frame = cap.read()
                    if not ret: break
                else:
                    # Dummy frame
                    frame = np.zeros((480, 640, 3), dtype=np.uint8)
                    cv2.putText(frame, "Camera Unavailable", (200, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                    time.sleep(0.1)

                # Process Frame
                results = vision_processor.process_frame(frame)
                landmarks = vision_processor.extract_landmarks(results)

                # Append to sequence
                sequence.append(landmarks)
                sequence = sequence[-SEQUENCE_LENGTH:]

                # Draw Landmarks (simplified)
                if results.left_hand_landmarks:
                    for lm in results.left_hand_landmarks.landmark:
                        h, w, c = frame.shape
                        cv2.circle(frame, (int(lm.x * w), int(lm.y * h)), 5, (255, 0, 0), -1)

                # Predict
                prediction_text = "Waiting..."
                if len(sequence) == SEQUENCE_LENGTH:
                    input_tensor = torch.FloatTensor(np.array(sequence)).unsqueeze(0).to(trainer.device)
                    with torch.no_grad():
                        logits = model(input_tensor)
                        probs = torch.softmax(logits, dim=1)
                        conf, pred_idx = torch.max(probs, 1)

                        if conf.item() > 0.7:
                            token = SEMANTIC_TOKENS[pred_idx.item()]
                            prediction_text = token
                            translations = translator.translate(token)

                            token_display.metric("Detected Token", token)
                            eng_display.info(f"🇺🇸 {translations['English']}")
                            hin_display.success(f"🇮🇳 {translations['Hindi']}")
                            mal_display.warning(f"🇮🇳 {translations['Malayalam']}")
                            jap_display.error(f"🇯🇵 {translations['Japanese']}")
                        else:
                            prediction_text = "Low Confidence"

                # Display Frame
                cv2.putText(frame, prediction_text, (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image_placeholder.image(frame, channels="RGB")

                time.sleep(0.05) # Simulate frame rate

# ==========================================
# ADMIN MODE: RECORDING & TRAINING
# ==========================================
else:
    st.header("Admin Dashboard: Data Collection & Training")

    tab1, tab2, tab3 = st.tabs(["Record New Gestures", "Manage Dataset", "Train Model"])

    with tab1:
        st.subheader("Record Samples")

        c1, c2 = st.columns(2)
        with c1:
            target_lang = st.selectbox("Language Context", LANGUAGES)
            target_token = st.selectbox("Select Semantic Token", SEMANTIC_TOKENS)
        with c2:
            signer_id = st.text_input("Signer Name/ID", "Admin")
            num_samples = st.number_input("Number of samples to record", 1, 10, 5)

        if st.button("Start Recording"):
            st.info(f"Get ready to sign '{target_token}'...")
            time.sleep(2)

            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                st.warning("Camera not detected. Simulating recording.")

            progress_bar = st.progress(0)

            for i in range(num_samples):
                st.write(f"Recording Sample {i+1}/{num_samples}")
                frames = []

                # Record for specific frames/time (e.g., 30 frames)
                for f_idx in range(SEQUENCE_LENGTH):
                    if cap.isOpened():
                        ret, frame = cap.read()
                        if not ret: break
                    else:
                        frame = np.zeros((480, 640, 3), dtype=np.uint8)
                        cv2.putText(frame, "Recording...", (200, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

                    # Extract Features immediately
                    results = vision_processor.process_frame(frame)
                    landmarks = vision_processor.extract_landmarks(results)
                    frames.append(landmarks)

                    # Visual feedback
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    st.image(frame_rgb, width=300, caption=f"Sample {i+1} Frame {f_idx}")
                    time.sleep(0.03)

                # Save Sample
                dataset_manager.save_sample(
                    target_lang,
                    target_token,
                    frames,
                    {'signer': signer_id}
                )
                progress_bar.progress((i + 1) / num_samples)
                st.success(f"Sample {i+1} Saved!")
                time.sleep(1)

            st.success("Recording Complete!")

    with tab2:
        st.subheader("Dataset Statistics")
        stats = dataset_manager.get_stats()
        st.json(stats)

    with tab3:
        st.subheader("Model Training")
        st.write("Click below to retrain the model on the current dataset.")

        epochs = st.slider("Epochs", 5, 50, 20)

        if st.button("Train Model"):
            with st.spinner("Training in progress..."):
                result = trainer.train(epochs=epochs)

            if result['status'] == 'success':
                st.balloons()
                st.success(f"Training Complete! Final Loss: {result['final_loss']:.4f}")
            else:
                st.error(f"Training Failed: {result['message']}")
