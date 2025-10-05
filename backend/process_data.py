import os
import cv2
import mediapipe as mp
import pandas as pd
import numpy as np

DATA_DIR = './dataset'
OUTPUT_CSV = 'landmarks.csv'

mp_hands = mp.solutions.hands
# Initialize MediaPipe Hands with high confidence
hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.6)

data = []
labels = []

print("Starting FINAL data processing with robust normalization...")
# Get a sorted list of labels to ensure consistent order
label_dirs = sorted([d for d in os.listdir(DATA_DIR) if os.path.isdir(os.path.join(DATA_DIR, d))])

for label in label_dirs:
    label_dir = os.path.join(DATA_DIR, label)
    
    print(f"Processing label: {label}")
    image_files = os.listdir(label_dir)
    
    for img_name in image_files:
        img_path = os.path.join(label_dir, img_name)
        
        try:
            img = cv2.imread(img_path)
            if img is None:
                print(f"  - Warning: Could not read image {img_path}, skipping.")
                continue

            # Process the image to find hand landmarks
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            results = hands.process(img_rgb)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    # --- FINAL, ROBUST NORMALIZATION ---
                    # 1. Get all landmarks relative to the wrist's position (removes location bias)
                    wrist = hand_landmarks.landmark[0]
                    landmarks = np.array([[lm.x - wrist.x, lm.y - wrist.y] for lm in hand_landmarks.landmark])

                    # 2. Normalize by the maximum absolute value (makes it scale-invariant)
                    # This ensures the model focuses on the SHAPE, not the size of the hand.
                    max_val = np.abs(landmarks).max()
                    if max_val == 0: continue # Skip if the hand is just a single point
                    
                    landmarks /= max_val
                    
                    # Flatten the 21x2 array into a single 42-element row
                    data.append(landmarks.flatten())
                    labels.append(label)
        except Exception as e:
            print(f"  - Error processing {img_path}: {e}")

# Save the processed data to a clean CSV file
df = pd.DataFrame(data)
df['label'] = labels
df.to_csv(OUTPUT_CSV, index=False)

hands.close()
print(f"\n[+] Processing complete. Data saved to {OUTPUT_CSV}")
print(f"[+] Total samples processed: {len(df)}. Total features: {len(df.columns)-1}.")

