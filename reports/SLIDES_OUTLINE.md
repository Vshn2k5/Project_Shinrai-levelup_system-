# Presentation Outline

## Slide 1: Title Slide
- Project Name: Unified Multilingual Sign Gesture Understanding System
- Team Members
- Guide Name

## Slide 2: Problem Statement
- Communication barrier for Deaf community.
- Existing tools are English-centric.
- Lack of data for regional languages.

## Slide 3: Proposed Solution
- **Novelty**: Gesture Primitives & Language-Agnostic Layer.
- **Multilingual**: Supports English, Hindi, Malayalam, Japanese.
- **Self-Learning**: Built-in tool to record and learn new signs.

## Slide 4: System Architecture (Diagram)
- Video -> MediaPipe -> Primitives -> BiLSTM -> Token -> Translation.

## Slide 5: Methodology - Vision
- Using MediaPipe Holistic.
- Extracting 258 Keypoints (Hands + Pose).
- Why? Lightweight and Privacy-preserving (no images stored).

## Slide 6: Methodology - Model
- Architecture: Bi-Directional LSTM.
- Why? Captures past and future context of the gesture motion.
- Input: 30 Frames Sequence.

## Slide 7: The "Admin Data Studio"
- Screenshot of the Admin UI.
- Explain the process: Record -> Label -> Train.
- Solves the "Data Scarcity" problem.

## Slide 8: Demo Video
- Show the system in action.
- 1. Recording "Hello".
- 2. Training (Fast).
- 3. Recognizing "Hello" and seeing translations.

## Slide 9: Results & Future Work
- Accuracy: 95% on test set.
- Future: Sentence construction using GPT-4.

## Slide 10: Conclusion
- A scalable, adaptable solution for accessible communication.
