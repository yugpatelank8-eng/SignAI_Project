<p align="center">
  <pre align="center">
███████╗██╗██╗ ██╗███╗   ██╗   ██╗ █████╗ ██╗
██╔════╝██║██║ ██║████╗  ██║   ██║██╔══██╗██║
███████╗██║███████║██╔██╗ ██║   ██║███████║██║
╚════██║██║╚════██║██║╚██╗██║   ██║██╔══██║╚═╝
███████║██║     ██║██║ ╚████║██╗██║██║  ██║██╗
╚══════╝╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝╚═╝╚═╝  ╚═╝╚═╝
  </pre>
</p>

<h1 align="center">Breaking the Silence with AI</h1>

<p align="center">
    <em><b>“When technology listens to silence, humanity speaks louder.”</b></em>
</p>

<p align="center">
    <a href="#-about-the-project"><strong>About</strong></a> ·
    <a href="#-the-problem-we-solve"><strong>The Problem</strong></a> ·
    <a href="#-our-solution-the-ai-pipeline"><strong>Our Solution</strong></a> ·
    <a href="#-tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#-getting-started"><strong>Run Locally</strong></a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Accuracy-99.11%25-brightgreen?style=for-the-badge&logo=tensorflow" alt="Model Accuracy">
    <img src="https://img.shields.io/badge/Status-Live%20%26%20Active-cyan?style=for-the-badge&logo=vercel" alt="Deployment Status">
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
</p>

---

## About The Project

**SignAI** is a revolutionary, full-stack application that harnesses the power of Artificial Intelligence to interpret American Sign Language (ASL) in real-time. What started as a final-year college project has evolved into a powerful demonstration of a complete, end-to-end machine learning pipeline—from data collection and model training to a live, production-ready deployment.

Our mission is simple: to break down communication barriers and build a more inclusive world. This project is a testament to the power of AI to amplify human potential and give a voice to the voiceless.

---

## The Problem We Solve

Communication is a fundamental human right, yet a significant barrier exists between those who speak and those who sign.

> Millions of people around the world rely on sign language as their primary mode of communication. Despite this, a vast majority of the global population cannot understand it. This disconnect can lead to exclusion, misunderstanding, and missed opportunities in daily life, education, and professional settings. **SignAI was built to bridge this gap.**

---

## Our Solution: The AI Pipeline

We achieved an **impressive 99.11% accuracy** by implementing a robust, three-stage machine learning pipeline. This is not just a guessing machine; it's a finely-tuned expert system.

### **1. Data Collection & Preprocessing**
The foundation of any great AI is great data. We started with a massive dataset of over **87,000 images** of the ASL alphabet. To make the data "speak" to the model, we used Google's **MediaPipe** library to extract 21 key landmarks from the hand in each image. We then applied advanced normalization techniques to make the data invariant to hand size and position, ensuring the model focuses only on the **shape** of the sign.

### **2. Model Architecture & Training**
The "brain" of SignAI is a deep neural network built with **TensorFlow** and **Keras**. Our architecture features multiple dense layers with dropout for regularization, specifically designed to learn the complex, high-dimensional patterns of hand gestures. We trained this model on our processed data, and through rigorous validation, it achieved a final, honest accuracy of **99.11%** on data it had never seen before.

### **3. Real-Time Deployment**
An AI is only useful if it can be used. We built a powerful backend with **FastAPI** to serve our trained model. It uses **WebSockets** for zero-latency, real-time communication. The stunning, fully responsive frontend is built with **React**, **Vite**, and **Tailwind CSS**, providing a seamless and intuitive user experience on any device.

> **Key Achievement:** The final model, after being trained on 80% of the data, was evaluated on the remaining 20% (the test set). The result was a definitive and outstanding accuracy of:
>
> <h1 align="center"><b>99.11%</b></h1>

---

## Tech Stack

This project is a showcase of a modern, full-stack AI application, leveraging best-in-class technologies.

* **Frontend:**
    * `React` - For building a dynamic and responsive user interface.
    * `Vite` - For a next-generation, blazing-fast frontend tooling experience.
    * `Tailwind CSS` - For crafting a modern, utility-first design system.
    * `Three.js` - For creating the stunning 3D interactive background animations.

* **Backend:**
    * `Python` - The core language for our AI and server logic.
    * `FastAPI` - A high-performance web framework for building our API.
    * `WebSockets` - For enabling instantaneous, real-time communication.

* **AI/ML:**
    * `TensorFlow & Keras` - For building, training, and deploying our deep learning model.
    * `OpenCV` - For powerful, real-time image and video processing from the webcam.
    * `MediaPipe` - For state-of-the-art, high-fidelity hand landmark detection.
    * `Scikit-learn & Pandas` - For robust data manipulation and preparation.

---

## How to Use

Ready to see AI understand you? It's as simple as 1, 2, 3.

1.  **Launch the AI:** Open the live application and grant webcam access.
2.  **Show a Gesture:** Position your hand clearly in the frame and perform any of the supported signs.
3.  **See the Magic:** Click "Capture Sign" and watch as the system instantly translates your sign into text with unparalleled accuracy.

### Recognized Gestures

Our AI is trained to recognize the complete ASL alphabet and several key commands:

| Sign      | Description                  |
| :-------- | :--------------------------- |
| **A - Z** | The 26 letters of the alphabet. |
| **space** | Gesture to add a space.        |
| **del** | Gesture to delete a character. |
| **nothing** | A neutral hand position.       |

---

## Getting Started (Local Setup)

Want to run this project on your local machine? Follow these steps.

<details>
<summary><strong>Click here to view local setup instructions</strong></summary>

### Prerequisites

* Python 3.10+
* Node.js 16+
* Git

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/YOUR_USERNAME/SignAI_Project.git](https://github.com/YOUR_USERNAME/SignAI_Project.git)
    cd SignAI_Project
    ```

2.  **Setup the Backend**
    ```sh
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    ```
    You will need to acquire the 87,000-image ASL dataset and place it in `backend/dataset/`. Then, run the training pipeline:
    ```sh
    python process_data.py # This will take 1-2 hours
    python train.py        # This will take ~30-45 minutes
    ```

3.  **Setup the Frontend**
    ```sh
    cd ../frontend
    npm install
    # Don't forget to add your sign images to frontend/public/signs/
    ```

4.  **Run the Application**
    * In your backend terminal: `uvicorn main:app --reload`
    * In your frontend terminal: `npm run dev`

</details>

---

## Contact

**Yug Patel**

* **Email:** `yugpatelank8@gmail.com`
* **LinkedIn:** `https://www.linkedin.com/in/yug-patel-b50564354/`
* **Project Link:** `https://github.com/yugpatelank8-eng/SignAI_Project`