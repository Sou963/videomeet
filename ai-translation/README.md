# Meta SeamlessM4T v2 Speech-to-Speech Translation Service

FastAPI microservice providing AI-powered speech-to-speech translation between **Bengali (`ben`)** and **English (`eng`)** using Meta's official [SeamlessM4T v2 model](https://huggingface.co/facebook/seamless-m4t-v2-large).

---

## Features

- **Pure Speech-to-Speech**: Translates incoming spoken audio directly into synthesized spoken audio (no text/subtitles displayed).
- **Bengali ↔ English**: Bidirectional speech translation (`ben` ↔ `eng`).
- **Standard Audio Format**: Accepts WAV/PCM/WebM audio and returns standard 16-bit 16kHz PCM WAV.
- **Single Model Load**: Weights are loaded once during startup and kept in memory for inference.
- **Hardware Adaptability**: Automatic CUDA GPU acceleration if available, with graceful CPU fallback and RAM checks.

---

## Prerequisites & Hardware Requirements

- **Python**: 3.10+ (tested on Python 3.10 - 3.13)
- **RAM**:
  - **With CUDA GPU**: 8GB+ VRAM recommended (NVIDIA RTX 3070/3080/4080/4090 or T4/A10G).
  - **On CPU**: 12GB+ System RAM recommended for `facebook/seamless-m4t-v2-large`.
- **Note on CPU Latency**: SeamlessM4T v2 Large has ~2.3 billion parameters. Running on CPU is functional but will have inference latency proportional to audio chunk length. For production real-time use, a CUDA-compatible GPU is strongly recommended.

---

## Installation

1. Navigate to the `ai-translation` directory:
   ```bash
   cd ai-translation
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (optional):
   ```bash
   cp .env.example .env
   ```

---

## Starting the Service

Run the service using Uvicorn:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

The API will be available at `http://localhost:8001`.

---

## API Endpoints

### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "service": "Meta SeamlessM4T v2 Speech-to-Speech",
  "model": "facebook/seamless-m4t-v2-large",
  "model_loaded": true,
  "device": "cuda",
  "supported_languages": {
    "ben": "Bengali (বাংলা)",
    "eng": "English"
  }
}
```

### 2. Translate Speech
```http
POST /translate?tgt_lang=eng&src_lang=ben
```
- **Content-Type**: `audio/wav` or `multipart/form-data`
- **Body**: Raw audio bytes or multipart form file `file`
- **Response**: `audio/wav` binary stream (16kHz mono 16-bit PCM WAV)

---

## Testing Speech Translation with curl

Translate a Bengali audio file into English speech:
```bash
curl -X POST "http://localhost:8001/translate?tgt_lang=eng&src_lang=ben" \
     -H "Content-Type: audio/wav" \
     --data-binary "@bengali_speech.wav" \
     --output "translated_english.wav"
```

Translate an English audio file into Bengali speech:
```bash
curl -X POST "http://localhost:8001/translate?tgt_lang=ben&src_lang=eng" \
     -H "Content-Type: audio/wav" \
     --data-binary "@english_speech.wav" \
     --output "translated_bengali.wav"
```
