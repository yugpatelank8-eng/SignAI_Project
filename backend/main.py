import cv2
import base64
import numpy as np
import tensorflow as tf
import mediapipe as mp  # <-- THE TYPO IS FIXED HERE
import joblib
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# --- Initialize the FastAPI App ---
app = FastAPI(title="SignAI API")
# Allow Netlify to connect
origins = ["http://localhost:5173", "http://localhost:3000", "https://*.netlify.app"] 
app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins, 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# --- Load Model and Utilities ---
print("[*] Loading trained model and utilities...")
try:
    model = tf.keras.models.load_model('sign_model.h5')
    label_encoder = joblib.load('label_encoder.joblib')
    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.7)
    print("[+] Server is ready and model is loaded.")
except Exception as e:
    print(f"!!! FATAL ERROR: Could not load model. Error: {e}")
    model = None

# --- High-Performance Prediction Function ---
@tf.function
def predict_with_model(input_data):
    if model is not None:
        return model(input_data, training=False)
    return None

def predict_from_frame(frame):
    if model is None: return "Model Not Loaded"
    try:
        frame = cv2.flip(frame, 1)
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)
        
        prediction = "Show Hand"
        
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                wrist = hand_landmarks.landmark[0]
                landmarks = np.array([[lm.x - wrist.x, lm.y - wrist.y] for lm in hand_landmarks.landmark])

                max_val = np.abs(landmarks).max()
                if max_val == 0: return "Show Hand"
                landmarks /= max_val
                
                input_data = landmarks.flatten().reshape(1, -1)
                
                predictions_tensor = predict_with_model(tf.constant(input_data, dtype=tf.float32))
                if predictions_tensor is None: return "Model Error"

                predictions = predictions_tensor.numpy()
                predicted_idx = np.argmax(predictions)
                confidence = np.max(predictions)

                if confidence > 0.8:
                    prediction = label_encoder.inverse_transform([predicted_idx])[0]
                else:
                    prediction = "Uncertain"
        
        return prediction
    except Exception as e:
        print(f"!!! PREDICTION ERROR: {e}")
        return "Error"

# --- WebSocket Endpoint ---
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("[+] WebSocket connection accepted.")
    try:
        while True:
            data = await websocket.receive_text()
            img_data = base64.b64decode(data.split(',')[1])
            np_arr = np.frombuffer(img_data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            prediction = predict_from_frame(frame)
            await websocket.send_text(prediction)
    except WebSocketDisconnect:
        print("[-] Client disconnected.")

@app.get("/")
def read_root():
    return {"message": "Sign AI Backend is running"}