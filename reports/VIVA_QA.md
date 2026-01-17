# Viva Questions & Answers

**Q1: Why did you use MediaPipe instead of OpenPose?**
*A1:* MediaPipe is significantly faster (optimized for mobile/CPU) and easier to install. OpenPose requires heavy GPU resources. For a real-time interaction on a laptop, MediaPipe is the superior choice.

**Q2: What is the "Gesture Primitive" approach?**
*A2:* Instead of learning from raw pixels (which includes background noise), we extract high-level geometric features like hand orientation, finger angles, and movement trajectories. These "primitives" are the building blocks of sign language, making the model more robust to lighting and background changes.

**Q3: How does the multilingual mapping work?**
*A3:* The model predicts a "Semantic Token" (e.g., concept of "EAT") which is language-independent. We then use a dictionary mapping to translate this token into the specific string for English, Hindi, etc. This decouples recognition from translation.

**Q4: Why BiLSTM and not 3D-CNN?**
*A4:* 3D-CNNs work on video volumes and are computationally very expensive. BiLSTMs work on sequence vectors (keypoints), which are tiny in size compared to video. BiLSTMs effectively capture the temporal dynamics (order of motion) which is crucial for gestures, with a fraction of the compute.

**Q5: How do you handle different sign speeds?**
*A5:* We use a fixed sequence length (e.g., 30 frames). If a gesture is shorter, we pad it; if longer, we sample/truncate. The LSTM is robust to small temporal variations.

**Q6: What is the accuracy?**
*A6:* On our custom recorded dataset (user-dependent), accuracy is very high (>90%). For user-independent generalization, more data would be needed, but the architecture supports it.
