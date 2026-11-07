import logging
import torch
import numpy as np
from typing import Optional, Tuple
from app.config import settings

logger = logging.getLogger("seamless_translator")

# Language code normalizer for Meta SeamlessM4T v2
LANG_MAP = {
    "bn": "ben",
    "ben": "ben",
    "bengali": "ben",
    "bangla": "ben",
    "en": "eng",
    "eng": "eng",
    "english": "eng",
}

class SeamlessTranslator:
    def __init__(self):
        self.model = None
        self.processor = None
        self.device = settings.device
        self.is_ready = False
        self.load_error = None

    def check_hardware_requirements(self) -> dict:
        """Inspects available hardware and RAM/VRAM before loading."""
        info = {
            "device": self.device,
            "cuda_available": torch.cuda.is_available(),
            "total_ram_gb": settings.total_ram_gb,
            "free_ram_gb": settings.free_ram_gb,
            "model_name": settings.model_name,
            "vram_gb": 0.0,
        }
        if torch.cuda.is_available():
            vram_bytes = torch.cuda.get_device_properties(0).total_memory
            info["vram_gb"] = round(vram_bytes / (1024 ** 3), 2)
        return info

    def load_model(self):
        """Loads AutoProcessor and SeamlessM4Tv2Model once at startup."""
        if self.is_ready:
            return

        hw = self.check_hardware_requirements()
        logger.info(f"Hardware configuration: {hw}")

        # Safety check: Large model weights are ~9.2 GB unquantized.
        if self.device == "cpu" and settings.free_ram_gb < 4.0:
            logger.warning(
                f"Low system RAM ({settings.free_ram_gb} GB free). "
                "Loading facebook/seamless-m4t-v2-large on CPU may require virtual memory or cause high latency."
            )

        try:
            logger.info(f"Loading SeamlessM4T processor and model: {settings.model_name} on {self.device}...")
            from transformers import AutoProcessor, SeamlessM4Tv2Model

            self.processor = AutoProcessor.from_pretrained(settings.model_name)

            # Load model with appropriate dtype and device
            if self.device == "cuda":
                self.model = SeamlessM4Tv2Model.from_pretrained(
                    settings.model_name,
                    torch_dtype=torch.float16,
                    device_map="auto",
                )
            else:
                self.model = SeamlessM4Tv2Model.from_pretrained(
                    settings.model_name,
                    torch_dtype=torch.float32,
                    low_cpu_mem_usage=True,
                ).to(self.device)

            self.model.eval()
            self.is_ready = True
            self.load_error = None
            logger.info("Meta SeamlessM4T v2 loaded successfully and ready for inference.")

        except Exception as e:
            self.load_error = str(e)
            self.is_ready = False
            logger.error(f"Failed to load SeamlessM4T model '{settings.model_name}': {e}", exc_info=True)
            # Re-raise so startup logs capture the exact failure if required
            raise

    def normalize_lang(self, lang: Optional[str], default: str = "eng") -> str:
        if not lang:
            return default
        code = lang.strip().lower()
        if code in LANG_MAP:
            return LANG_MAP[code]
        raise ValueError(
            f"Unsupported language: '{lang}'. Meta SeamlessM4T v2 in this service supports 'ben' (Bengali) and 'eng' (English)."
        )

    def translate_speech(
        self,
        audio_array: np.ndarray,
        tgt_lang: str = "eng",
        src_lang: Optional[str] = None,
    ) -> Tuple[np.ndarray, int]:
        """
        Executes speech-to-speech translation using Meta SeamlessM4T v2.

        Args:
            audio_array: 1D float32 numpy array sampled at 16,000 Hz
            tgt_lang: Target language code ('eng' or 'ben')
            src_lang: Optional source language code ('ben' or 'eng')

        Returns:
            (waveform_array, sample_rate)
        """
        if not self.is_ready or self.model is None or self.processor is None:
            raise RuntimeError(f"SeamlessM4T model is not ready. Status: {self.load_error or 'Not loaded'}")

        target_code = self.normalize_lang(tgt_lang, default="eng")
        source_code = self.normalize_lang(src_lang, default=None) if src_lang else None

        # Audio duration check
        duration = len(audio_array) / 16000.0
        if duration < settings.min_duration_seconds:
            raise ValueError(f"Audio chunk too short ({duration:.2f}s). Minimum {settings.min_duration_seconds}s required.")
        if duration > settings.max_duration_seconds:
            # Trim to max duration
            audio_array = audio_array[: int(settings.max_duration_seconds * 16000)]

        # Prepare audio inputs with AutoProcessor
        processor_kwargs = {
            "audios": audio_array,
            "sampling_rate": 16000,
            "return_tensors": "pt",
        }
        if source_code:
            processor_kwargs["src_lang"] = source_code

        inputs = self.processor(**processor_kwargs)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        # Generate translated speech audio
        with torch.no_grad():
            output = self.model.generate(
                **inputs,
                tgt_lang=target_code,
            )

        # SeamlessM4Tv2Model returns generated speech audio tensor as first element
        output_waveform = output[0].cpu().numpy().squeeze()
        sample_rate = getattr(self.model.config, "sampling_rate", 16000)

        return output_waveform.astype(np.float32), sample_rate

translator = SeamlessTranslator()
