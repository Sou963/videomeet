# VideoMeet

VideoMeet is a modern full-stack video conferencing platform featuring native WebRTC peer-to-peer calls, Socket.IO signaling, Express REST API, MongoDB persistence, Next.js App Router UI, and **AI-powered Bengali ↔ English speech-to-speech translation powered by Meta SeamlessM4T v2**.

---

## Features

- **User Authentication**: Register, login, logout, and JWT session persistence.
- **Meeting Management**: Create instant meetings, schedule meetings, password protection, and meeting history.
- **Ultra-HD Video & Audio**: Native browser WebRTC peer-to-peer mesh audio/video.
- **Screen Sharing**: Live browser display media sharing.
- **Real-Time Collaboration**: Socket.IO meeting chat, floating emoji reactions, hand raising, and host announcements.
- **Live AI Speech-to-Speech Translation (Meta SeamlessM4T v2)**:
  - Direct voice-to-voice translation between **Bengali (`ben`)** and **English (`eng`)**.
  - No text subtitles or captions are displayed; translation output is purely synthesized speech.
  - Independent target language selection for each participant.
  - Automatically mutes original peer audio locally while translation audio is active, preventing feedback loops.

---

## Architecture

- **Frontend**: Next.js App Router (React, Tailwind CSS)
- **Backend API & Signaling**: Node.js, Express.js, Socket.IO, MongoDB Mongoose
- **AI Translation Service**: Python 3.10+, FastAPI, PyTorch, Hugging Face `transformers` with `facebook/seamless-m4t-v2-large`

---

## Hardware & VRAM Considerations for SeamlessM4T v2

- **Recommended (with CUDA GPU)**:
  - NVIDIA GPU with 8GB+ VRAM (RTX 3070/3080/4080/4090 or AWS/Cloud T4/A10G).
  - CUDA provides fast speech-to-speech generation.
- **CPU Fallback**:
  - Requires 12GB+ System RAM.
  - When running on CPU without dedicated GPU, inference takes longer depending on the duration of the audio chunk.
  - The service checks available RAM and VRAM before attempting to load the model to prevent application crashes.

---

## Setup & Startup Instructions

### 1. Python AI Translation Service (Port 8001)

1. Open a terminal and enter the `ai-translation` directory:
   ```bash
   cd ai-translation
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment (optional, defaults work out-of-the-box):
   ```bash
   cp .env.example .env
   ```

5. Start the FastAPI service:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8001
   ```
   Verify service health:
   ```bash
   curl http://localhost:8001/health
   ```

---

### 2. Express Backend API & Socket.IO (Port 5000)

1. Open another terminal and enter the `server` directory:
   ```bash
   cd server
   npm install
   ```

2. Configure `server/.env`:
   ```bash
   cp .env.example .env
   ```
   Set your MongoDB URI, JWT Secret, and AI translation URL:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000
   AI_TRANSLATION_URL=http://localhost:8001
   ```

3. Start the backend:
   ```bash
   npm run dev
   ```

---

### 3. Next.js Frontend (Port 3000)

1. In the repository root, install dependencies:
   ```bash
   npm install
   ```

2. Configure `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Ensure backend and AI endpoints are set:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   NEXT_PUBLIC_AI_TRANSLATION_URL=http://localhost:8001
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` in your browser.

---

## How to Test Bengali ↔ English Voice Translation

### Test Bengali Speech → English Generated Speech:
1. Join a meeting from two browser windows or devices (Participant A and Participant B).
2. On Participant B's screen:
   - Click the **Translation** tab in the sidebar.
   - Toggle **Turn On** to enable live translation.
   - Set **Preferred Listening Language** to **English**.
3. Participant A speaks in Bengali into their microphone.
4. Participant B's browser captures the audio chunk, forwards it to Meta SeamlessM4T v2, and receives synthesized English speech.
5. Participant B hears the translated English voice through their speakers. Participant A's original voice is muted locally on Participant B's device to avoid double-audio.

### Test English Speech → Bengali Generated Speech:
1. On Participant A's screen:
   - Click the **Translation** tab in the sidebar.
   - Toggle **Turn On** to enable live translation.
   - Set **Preferred Listening Language** to **Bengali (বাংলা)**.
2. Participant B speaks in English into their microphone.
3. Participant A hears the translated Bengali voice through their speakers.

---

## Common Installation & Inference Errors

1. **`CUDA out of memory`**:
   - Cause: GPU has insufficient free VRAM for `seamless-m4t-v2-large`.
   - Fix: Set `DEVICE=cpu` in `ai-translation/.env` or reduce chunk lengths.
2. **`Could not decode audio data`**:
   - Cause: Audio chunk was empty or corrupted during WebRTC stream transition.
   - Fix: The browser client automatically discards chunks shorter than 0.5s or below the voice activity threshold.
3. **`Connection refused at http://localhost:8001`**:
   - Cause: The FastAPI service is not started.
   - Fix: Ensure `uvicorn app.main:app --port 8001` is running. The Express proxy will report descriptive status if the service is offline.
