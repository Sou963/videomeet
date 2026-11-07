import os
import psutil

class Settings:
    def __init__(self):
        self.model_name: str = os.getenv("MODEL_NAME", "facebook/seamless-m4t-v2-large")
        self.port: int = int(os.getenv("PORT", "8001"))
        self.host: str = os.getenv("HOST", "0.0.0.0")
        self.target_sample_rate: int = 16000
        self.min_duration_seconds: float = 0.4
        self.max_duration_seconds: float = 30.0

        # Hardware & device configuration
        configured_device = os.getenv("DEVICE", "auto").lower()

        cuda_available = False
        try:
            import torch
            cuda_available = torch.cuda.is_available()
        except ImportError:
            pass

        if configured_device == "cuda" and cuda_available:
            self.device: str = "cuda"
        elif configured_device == "cpu":
            self.device: str = "cpu"
        else:
            self.device: str = "cuda" if cuda_available else "cpu"

        # Check system memory
        mem = psutil.virtual_memory()
        self.total_ram_gb: float = round(mem.total / (1024 ** 3), 2)
        self.free_ram_gb: float = round(mem.available / (1024 ** 3), 2)

        # SeamlessM4T v2 official language mapping
        self.supported_languages = {
            "ben": "Bengali",
            "eng": "English",
        }

settings = Settings()
