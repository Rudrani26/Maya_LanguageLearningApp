from io import BytesIO
import tempfile
import time
import traceback
import logging

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pyparsing import Tuple, lru_cache
import torchaudio
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
import soundfile as sf
import numpy as np
from pydub import AudioSegment
from pathlib import Path as PathLib
from transformers import AutoTokenizer, VitsModel

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up detailed logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load model and processor
logger.info("Loading Wav2Vec2 model and processor...")
model_name = "sumedh/wav2vec2-large-xlsr-marathi"
processor = Wav2Vec2Processor.from_pretrained(model_name)
model = Wav2Vec2ForCTC.from_pretrained(model_name)
logger.info("Wav2Vec2 model and processor loaded successfully.")

VALID_AUDIO_MIME_TYPES = ["audio/wav", "audio/x-wav", "audio/mp4", "audio/m4a", "audio/x-m4a", "audio/aac", "audio/mpeg"]

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    logger.info(f"Received transcription request for file: {file.filename}")
    if file.content_type not in VALID_AUDIO_MIME_TYPES:
        error_msg = f"Invalid file type: {file.content_type}. Supported types: {', '.join(VALID_AUDIO_MIME_TYPES)}"
        logger.error(error_msg)
        raise HTTPException(status_code=400, detail=error_msg)

    try:
        audio_bytes = await file.read()
        logger.info(f"File {file.filename} read successfully. Size: {len(audio_bytes)} bytes.")

        # Convert M4A to WAV if needed
        if file.content_type in ["audio/mp4", "audio/m4a", "audio/x-m4a"]:
            logger.info(f"Converting file {file.filename} from M4A to WAV format.")
            audio = AudioSegment.from_file(BytesIO(audio_bytes), format="m4a")
            wav_bytes = BytesIO()
            audio.export(wav_bytes, format="wav")
            wav_bytes.seek(0)
            audio_bytes = wav_bytes.read()
            logger.info("Conversion to WAV completed.")

        # Load audio using torchaudio or fallback to soundfile
        try:
            logger.info(f"Attempting to load audio using torchaudio.")
            waveform, sample_rate = torchaudio.load(BytesIO(audio_bytes))
        except Exception as e:
            logger.warning(f"Torchaudio failed to load audio: {e}. Falling back to soundfile.")
            audio_data, sample_rate = sf.read(BytesIO(audio_bytes))
            waveform = torch.FloatTensor(audio_data)
            if len(waveform.shape) == 1:
                waveform = waveform.unsqueeze(0)

        logger.info(f"Audio loaded successfully. Sample rate: {sample_rate}, Shape: {waveform.shape}.")

        # Convert to mono if stereo
        if waveform.shape[0] > 1:
            logger.info(f"Converting stereo audio to mono.")
            waveform = torch.mean(waveform, dim=0, keepdim=True)

        # Resample if necessary
        if sample_rate != 16000:
            logger.info(f"Resampling audio from {sample_rate}Hz to 16000Hz.")
            resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)
            waveform = resampler(waveform)

        # Normalize audio
        logger.info(f"Normalizing audio waveform.")
        waveform = (waveform - waveform.mean()) / (waveform.std() + 1e-10)

        # Process audio and generate transcription
        input_values = processor(waveform.squeeze().numpy(), sampling_rate=16000, return_tensors="pt").input_values
        logger.info("Running inference on the audio.")
        with torch.no_grad():
            logits = model(input_values).logits
        predicted_ids = torch.argmax(logits, dim=-1)
        transcription = processor.decode(predicted_ids[0])

        logger.info(f"Transcription completed successfully: {transcription.strip()}")
        return {"transcription": transcription.strip()}

    except Exception as e:
        error_msg = f"Error processing audio file: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)

# Cache directory setup
CACHE_DIR = PathLib(tempfile.gettempdir()) / "tts_cache"
CACHE_DIR.mkdir(exist_ok=True)
logger = logging.getLogger(__name__)

@lru_cache(maxsize=1)
def get_tts_components() -> Tuple[VitsModel, AutoTokenizer, str]:
    """Initialize TTS components with error handling"""
    try:
        logger.info("Loading TTS model and tokenizer...")
        device = "cuda:0" if torch.cuda.is_available() else "cpu"
        model = VitsModel.from_pretrained("facebook/mms-tts-mar").to(device)
        tokenizer = AutoTokenizer.from_pretrained("facebook/mms-tts-mar")
        logger.info(f"TTS model and tokenizer loaded successfully on {device}")
        return model, tokenizer, device
    except Exception as e:
        logger.error(f"Failed to load TTS components: {str(e)}")
        raise RuntimeError(f"Failed to initialize TTS components: {str(e)}")

def get_cache_key(text: str) -> str:
    """Generate a unique cache key for the text"""
    return f"tts_{hash(text)}_{int(time.time())}"

def get_cached_audio_path(cache_key: str) -> PathLib:
    """Get the full path for cached audio file"""
    return CACHE_DIR / f"{cache_key}.wav"

def generate_audio(text: str, model: VitsModel, tokenizer: AutoTokenizer, device: str) -> np.ndarray:
    """Generate audio with proper error handling"""
    try:
        inputs = tokenizer(text, return_tensors="pt").to(device)
        with torch.no_grad():
            output = model(**inputs).waveform
        return output.cpu().numpy().squeeze()
    except Exception as e:
        logger.error(f"Failed to generate audio: {str(e)}")
        raise RuntimeError(f"Audio generation failed: {str(e)}")

class TTSRequest(BaseModel):
    text: str

@app.post("/tts/")
async def text_to_speech(request: TTSRequest):
    """Enhanced TTS endpoint with proper error handling and file management"""
    logger.info(f"Received TTS request for text: {request.text}")
    
    try:
        # Generate a unique cache key for each request
        cache_key = get_cache_key(request.text)
        cache_path = get_cached_audio_path(cache_key)

        # Clean up old cache files
        for old_file in CACHE_DIR.glob("tts_*.wav"):
            if time.time() - old_file.stat().st_mtime > 3600:  # Clean files older than 1 hour
                try:
                    old_file.unlink()
                except Exception as e:
                    logger.warning(f"Failed to delete old cache file {old_file}: {str(e)}")

        # Generate new audio
        model, tokenizer, device = get_tts_components()
        audio_arr = generate_audio(request.text, model, tokenizer, device)

        # Apply slowdown effect
        original_rate = model.config.sampling_rate
        slowed_rate = int(original_rate * 0.95)  # Slow down by 5%

        # Ensure audio array is valid
        if not np.isfinite(audio_arr).all():
            raise ValueError("Generated audio contains invalid values")

        # Normalize audio to prevent clipping
        audio_arr = np.clip(audio_arr, -1.0, 1.0)

        # Save audio with proper error handling
        try:
            sf.write(
                str(cache_path),
                audio_arr,
                slowed_rate,
                format='WAV',
                subtype='PCM_16'
            )
        except Exception as e:
            logger.error(f"Failed to save audio file: {str(e)}")
            raise RuntimeError(f"Failed to save audio file: {str(e)}")

        # Verify file was created and is readable
        if not cache_path.exists() or cache_path.stat().st_size == 0:
            raise RuntimeError("Generated audio file is empty or not created")

        logger.info(f"Audio generated successfully and saved at {cache_path}")

        # Return file with explicit headers
        return FileResponse(
            path=cache_path,
            media_type="audio/wav",
            filename="speech.wav",
            headers={
                "Content-Disposition": "attachment; filename=speech.wav",
                "Accept-Ranges": "bytes",
                "Cache-Control": "no-cache"
            }
        )

    except Exception as e:
        error_msg = f"Error in TTS processing: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=error_msg)