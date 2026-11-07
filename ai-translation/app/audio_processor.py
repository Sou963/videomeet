import io
import wave
import numpy as np

def resample_linear(audio: np.ndarray, orig_sr: int, target_sr: int) -> np.ndarray:
    """Fast linear interpolation resampling using pure NumPy without external binary dependencies."""
    if orig_sr == target_sr:
        return audio
    num_samples = int(len(audio) * float(target_sr) / float(orig_sr))
    indices = np.linspace(0, len(audio) - 1, num_samples)
    return np.interp(indices, np.arange(len(audio)), audio).astype(np.float32)

def load_audio_from_bytes(audio_bytes: bytes, target_sr: int = 16000) -> np.ndarray:
    """
    Decodes audio bytes into a 1D float32 NumPy array at 16,000 Hz normalized in [-1.0, 1.0].
    Supports WAV, SoundFile (FLAC, OGG, WebM if supported), and raw PCM.
    """
    if not audio_bytes or len(audio_bytes) == 0:
        raise ValueError("Received empty audio data.")

    # 1. Try standard WAV decoding first (fastest and zero-dependency)
    try:
        with wave.open(io.BytesIO(audio_bytes), "rb") as wav_file:
            n_channels = wav_file.getnchannels()
            sample_width = wav_file.getsampwidth()
            framerate = wav_file.getframerate()
            n_frames = wav_file.getnframes()
            raw_frames = wav_file.readframes(n_frames)

            if sample_width == 2:
                audio = np.frombuffer(raw_frames, dtype=np.int16).astype(np.float32) / 32768.0
            elif sample_width == 4:
                audio = np.frombuffer(raw_frames, dtype=np.int32).astype(np.float32) / 2147483648.0
            elif sample_width == 1:
                audio = (np.frombuffer(raw_frames, dtype=np.uint8).astype(np.float32) - 128.0) / 128.0
            else:
                audio = np.frombuffer(raw_frames, dtype=np.float32)

            if n_channels > 1:
                audio = audio.reshape(-1, n_channels).mean(axis=1)

            if framerate != target_sr:
                audio = resample_linear(audio, framerate, target_sr)

            return audio.astype(np.float32)
    except Exception:
        pass

    # 2. Try scipy.io.wavfile
    try:
        from scipy.io import wavfile
        sr, data = wavfile.read(io.BytesIO(audio_bytes))
        if data.dtype == np.int16:
            audio = data.astype(np.float32) / 32768.0
        elif data.dtype == np.int32:
            audio = data.astype(np.float32) / 2147483648.0
        elif data.dtype == np.uint8:
            audio = (data.astype(np.float32) - 128.0) / 128.0
        else:
            audio = data.astype(np.float32)

        if audio.ndim > 1:
            audio = audio.mean(axis=1)

        if sr != target_sr:
            audio = resample_linear(audio, sr, target_sr)

        return audio.astype(np.float32)
    except Exception:
        pass

    # 3. Try soundfile
    try:
        import soundfile as sf
        data, sr = sf.read(io.BytesIO(audio_bytes), dtype="float32")
        if data.ndim > 1:
            data = data.mean(axis=1)
        if sr != target_sr:
            data = resample_linear(data, sr, target_sr)
        return data.astype(np.float32)
    except Exception:
        pass

    # 4. Try torchaudio
    try:
        import torchaudio
        import torch
        tensor, sr = torchaudio.load(io.BytesIO(audio_bytes))
        if tensor.shape[0] > 1:
            tensor = tensor.mean(dim=0, keepdim=True)
        if sr != target_sr:
            resampler = torchaudio.transforms.Resample(sr, target_sr)
            tensor = resampler(tensor)
        return tensor.squeeze().numpy().astype(np.float32)
    except Exception:
        pass

    raise ValueError("Could not decode audio data. Please ensure audio is provided as valid WAV, WebM, or PCM.")

def audio_to_wav_bytes(waveform: np.ndarray, sample_rate: int = 16000) -> bytes:
    """
    Encodes a 1D float32 or int16 numpy array into standard 16-bit PCM RIFF WAV bytes.
    """
    if waveform.ndim > 1:
        waveform = waveform.squeeze()

    # Normalize and convert to 16-bit PCM
    if waveform.dtype != np.int16:
        # Clip to [-1.0, 1.0] to prevent clipping distortion
        clipped = np.clip(waveform, -1.0, 1.0)
        pcm_data = (clipped * 32767.0).astype(np.int16)
    else:
        pcm_data = waveform

    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav_out:
        wav_out.setnchannels(1)  # Mono
        wav_out.setsampwidth(2)  # 16-bit (2 bytes)
        wav_out.setframerate(sample_rate)
        wav_out.writeframes(pcm_data.tobytes())

    return buffer.getvalue()
