import logging
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, HTTPException, Request, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse

from app.config import settings
from app.audio_processor import load_audio_from_bytes, audio_to_wav_bytes
from app.translator import translator

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("ai_translation_api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Meta SeamlessM4T v2 Translation Service...")
    logger.info(f"Configured model: {settings.model_name}")
    logger.info(f"Hardware: {translator.check_hardware_requirements()}")
    try:
        translator.load_model()
    except Exception as exc:
        logger.warning(
            f"Model not immediately loaded at startup: {exc}. "
            "Service will remain online and attempt on-demand loading or return descriptive health status."
        )
    yield
    logger.info("Shutting down AI Translation Service.")

app = FastAPI(
    title="VideoMeet AI Speech-to-Speech Translation Service",
    description="Speech-to-Speech Bengali ↔ English translation powered by Meta SeamlessM4T v2",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint returning model status, device, and system resources."""
    hw = translator.check_hardware_requirements()
    return {
        "status": "ok",
        "service": "Meta SeamlessM4T v2 Speech-to-Speech",
        "model": settings.model_name,
        "model_loaded": translator.is_ready,
        "load_error": translator.load_error,
        "device": translator.device,
        "hardware": hw,
        "supported_languages": {
            "ben": "Bengali (বাংলা)",
            "eng": "English",
        },
    }

@app.post("/translate")
async def translate_audio_endpoint(
    request: Request,
    tgt_lang: str = Query("eng", description="Target language ('eng' for English, 'ben' for Bengali)"),
    src_lang: Optional[str] = Query(None, description="Optional source language ('ben' or 'eng')"),
    file: Optional[UploadFile] = File(None),
):
    """
    Accepts speech audio input, translates speech to speech with SeamlessM4T v2,
    and returns synthesized audio in the target language (audio/wav).
    """
    try:
        # 1. Extract audio bytes from multipart upload or raw request body
        audio_bytes = None
        if file is not None:
            audio_bytes = await file.read()
        else:
            audio_bytes = await request.body()

        if not audio_bytes or len(audio_bytes) == 0:
            raise HTTPException(status_code=400, detail="No audio data provided in request.")

        # 2. Decode & convert audio to 16kHz mono float32 array
        try:
            audio_array = load_audio_from_bytes(audio_bytes, target_sr=settings.target_sample_rate)
        except Exception as audio_err:
            raise HTTPException(status_code=400, detail=f"Audio decoding failed: {audio_err}")

        # 3. Ensure model is loaded
        if not translator.is_ready:
            try:
                translator.load_model()
            except Exception as load_err:
                raise HTTPException(
                    status_code=503,
                    detail=f"SeamlessM4T model could not be initialized: {load_err}",
                )

        # 4. Perform speech-to-speech translation
        translated_waveform, sample_rate = translator.translate_speech(
            audio_array=audio_array,
            tgt_lang=tgt_lang,
            src_lang=src_lang,
        )

        # 5. Encode generated waveform to standard 16-bit PCM WAV
        wav_bytes = audio_to_wav_bytes(translated_waveform, sample_rate=sample_rate)

        return Response(
            content=wav_bytes,
            media_type="audio/wav",
            headers={
                "Content-Disposition": f'inline; filename="translated_{tgt_lang}.wav"',
                "X-Target-Language": tgt_lang,
                "X-Sample-Rate": str(sample_rate),
            },
        )

    except HTTPException:
        raise
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as exc:
        logger.error(f"Inference error during translation: {exc}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Translation inference failed: {exc}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=False)
