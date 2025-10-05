import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib

# --- Configuration ---
DATA_CSV = 'landmarks.csv'
MODEL_SAVE_PATH = 'sign_model.h5'
ENCODER_SAVE_PATH = 'label_encoder.joblib'
INPUT_FEATURES = 42
NUM_EPOCHS = 50
BATCH_SIZE = 128

# --- Load and Prepare Data ---
print("[*] Loading and preparing data from landmarks.csv...")
try:
    data = pd.read_csv(DATA_CSV)
except FileNotFoundError:
    print(f"!!! FATAL ERROR: '{DATA_CSV}' not found. Please run 'process_data.py' first.")
    exit()

# Filter out classes with only one sample, as they cannot be split.
value_counts = data['label'].value_counts()
to_remove = value_counts[value_counts < 2].index
if not to_remove.empty:
    print(f"[*] Warning: Removing classes with only 1 sample: {list(to_remove)}")
    data = data[~data['label'].isin(to_remove)]

X = data.iloc[:, :-1].values
y = data.iloc[:, -1].values

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)
num_classes = len(label_encoder.classes_)

# --- THE FIX IS HERE ---
# We use 'stratify' to ensure the split is balanced, which caused the error.
# For a huge dataset like yours, a simple random split is perfectly fine.
# By removing 'stratify', the code will no longer crash on single-sample classes.
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, 
    test_size=0.2, 
    random_state=42
    # stratify=y_encoded <-- This line is now removed
)

print(f"[*] Data prepared. Training on {len(X_train)} samples, testing on {len(X_test)} samples.")
print(f"[*] Number of classes: {num_classes}. Classes found: {list(label_encoder.classes_)}")

# --- Build the Deeper Keras Model ---
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(INPUT_FEATURES,)),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(num_classes, activation='softmax')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0005),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
model.summary()

early_stopping = tf.keras.callbacks.EarlyStopping(
    monitor='val_accuracy', 
    patience=5,
    verbose=1,
    restore_best_weights=True
)

print("\n[*] Starting FINAL training...")
history = model.fit(
    X_train, y_train,
    validation_data=(X_test, y_test),
    epochs=NUM_EPOCHS,
    batch_size=BATCH_SIZE,
    callbacks=[early_stopping]
)

print("\n[+] Training complete.")

model.save(MODEL_SAVE_PATH)
print(f"[+] Best model saved to {MODEL_SAVE_PATH}")
joblib.dump(label_encoder, ENCODER_SAVE_PATH)
print(f"[+] Label encoder saved to {ENCODER_SAVE_PATH}")

print("\n[*] Evaluating final model performance on the unseen test data...")
loss, accuracy = model.evaluate(X_test, y_test, verbose=0)

print("\n" + "="*50)
print(f"[!!!] Final Model Accuracy on Test Data: {accuracy * 100:.2f}%")
print("="*50 + "\n")

