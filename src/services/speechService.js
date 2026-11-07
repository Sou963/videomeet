import { getVoiceLanguage } from "@/lib/speech";

/**
 * Encodes a 1D Float32Array into a 16-bit mono PCM RIFF WAV Blob.
 */
function encodeWavPcm16(samples, sampleRate = 16000) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // RIFF Chunk
  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");

  // fmt Subchunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, 1, true); // AudioFormat = 1 (PCM)
  view.setUint16(22, 1, true); // NumChannels = 1 (Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample = 16

  // data Subchunk
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  // Samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

/**
 * createTranslationSession
 *
 * Captures audio chunks from a remote participant's live MediaStream,
 * detects active speech, chunks the audio, and sends it to the Meta SeamlessM4T v2
 * speech-to-speech translation service.
 *
 * @param {MediaStream} stream - Remote participant's audio stream
 * @param {string} language - Target listening language ("eng" or "ben")
 * @param {string} meetingId - Meeting ID for authentication & validation
 * @param {function} onAudio - Callback with translated audio Blob (audio/wav)
 * @param {function} onStatus - Status change callback: "listening" | "translating" | "error"
 * @param {function} onError - Error notification callback
 */
export async function createTranslationSession({
  stream,
  language,
  meetingId,
  onAudio,
  onStatus,
  onError,
}) {
  const target = getVoiceLanguage(language);
  const targetCode = target ? target.code : "eng";

  if (!stream || stream.getAudioTracks().length === 0) {
    throw new Error("No live audio track available for translation.");
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error("Web Audio API is not supported in this browser.");
  }

  const audioCtx = new AudioContextClass();
  if (audioCtx.state === "suspended") {
    await audioCtx.resume().catch(() => {});
  }

  const sourceNode = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  sourceNode.connect(analyser);

  // ScriptProcessor to capture raw PCM audio at browser sample rate
  const bufferSize = 4096;
  const scriptProcessor = audioCtx.createScriptProcessor(bufferSize, 1, 1);
  sourceNode.connect(scriptProcessor);
  // Connect to a silent dummy destination so browser continues firing onaudioprocess
  const silentGain = audioCtx.createGain();
  silentGain.gain.value = 0;
  scriptProcessor.connect(silentGain);
  silentGain.connect(audioCtx.destination);

  let pcmChunks = [];
  let isSpeaking = false;
  let silenceCount = 0;
  let isSending = false;
  let isCancelled = false;

  const targetSampleRate = 16000;
  const nativeSampleRate = audioCtx.sampleRate;
  const SILENCE_THRESHOLD_RMS = 0.015;
  const SILENCE_FRAMES_TO_CUT = 18; // ~1.5 seconds of silence after speech
  const MAX_CHUNK_SAMPLES = targetSampleRate * 5; // 5 seconds max per chunk
  const MIN_CHUNK_SAMPLES = targetSampleRate * 0.5; // 0.5 second minimum

  onStatus("listening");

  // Resample buffer from native audioCtx sample rate to 16kHz
  function resampleTo16k(float32Array) {
    if (nativeSampleRate === targetSampleRate) return float32Array;
    const ratio = nativeSampleRate / targetSampleRate;
    const newLength = Math.round(float32Array.length / ratio);
    const result = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      const originalIndex = i * ratio;
      const lower = Math.floor(originalIndex);
      const upper = Math.min(lower + 1, float32Array.length - 1);
      const frac = originalIndex - lower;
      result[i] = float32Array[lower] * (1 - frac) + float32Array[upper] * frac;
    }
    return result;
  }

  async function sendChunkForTranslation(samples) {
    if (isSending || isCancelled) return;
    if (samples.length < MIN_CHUNK_SAMPLES) return;

    isSending = true;
    onStatus("translating");

    try {
      const wavBlob = encodeWavPcm16(samples, targetSampleRate);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const translateEndpoint = `${apiUrl}/translation/translate?tgt_lang=${encodeURIComponent(targetCode)}`;

      const response = await fetch(translateEndpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "audio/wav",
          "x-meeting-id": meetingId || "",
        },
        body: wavBlob,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message = errorBody?.message || response.statusText || "Translation failed";
        throw new Error(`AI translation error: ${message}`);
      }

      const translatedBlob = await response.blob();
      if (!isCancelled && translatedBlob.size > 100) {
        onAudio(translatedBlob);
      }
    } catch (err) {
      if (!isCancelled) {
        console.warn("SeamlessM4T translation request failed:", err.message);
        if (onError) onError(err.message || "Failed to generate translated voice.");
      }
    } finally {
      isSending = false;
      if (!isCancelled) onStatus("listening");
    }
  }

  scriptProcessor.onaudioprocess = (event) => {
    if (isCancelled) return;
    const inputData = event.inputBuffer.getChannelData(0);

    // Compute RMS volume
    let sum = 0;
    for (let i = 0; i < inputData.length; i++) {
      sum += inputData[i] * inputData[i];
    }
    const rms = Math.sqrt(sum / inputData.length);

    if (rms > SILENCE_THRESHOLD_RMS) {
      isSpeaking = true;
      silenceCount = 0;
      pcmChunks.push(new Float32Array(inputData));
    } else if (isSpeaking) {
      silenceCount++;
      pcmChunks.push(new Float32Array(inputData));

      const totalSamples = pcmChunks.reduce((acc, c) => acc + c.length, 0);

      // If speaker paused or maximum chunk length reached, send chunk
      if (silenceCount >= SILENCE_FRAMES_TO_CUT || totalSamples >= nativeSampleRate * 5) {
        isSpeaking = false;
        silenceCount = 0;

        const merged = new Float32Array(totalSamples);
        let offset = 0;
        for (const chunk of pcmChunks) {
          merged.set(chunk, offset);
          offset += chunk.length;
        }
        pcmChunks = [];

        const resampled16k = resampleTo16k(merged);
        sendChunkForTranslation(resampled16k);
      }
    }
  };

  return {
    language: targetCode,
    close: async () => {
      isCancelled = true;
      try {
        scriptProcessor.disconnect();
        silentGain.disconnect();
        sourceNode.disconnect();
        analyser.disconnect();
        if (audioCtx.state !== "closed") {
          await audioCtx.close().catch(() => {});
        }
      } catch {}
    },
  };
}
