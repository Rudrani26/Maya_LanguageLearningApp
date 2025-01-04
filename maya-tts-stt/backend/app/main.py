from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from tts_service import generate_tts_audio

# Create FastAPI instance
app = FastAPI()

# CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Pydantic model for the TTS request
class TTSRequest(BaseModel):
    text: str  # Text input for which TTS audio will be generated

# Endpoint to generate TTS audio
@app.post("/generate-audio/")
async def generate_audio(request: TTSRequest):
    """
    Endpoint to generate TTS audio for a given text (Marathi).
    """
    try:
        # Log the phrase being processed
        print(f"Generating TTS for phrase: {request.text}")

        # Generate the audio
        audio_file_path = generate_tts_audio(request.text)

        # Log the audio file path
        print(f"Audio saved to: {audio_file_path}")

        # Return the .wav file in the response
        return FileResponse(audio_file_path, media_type="audio/wav", filename="output_audio.wav")
    
    except Exception as e:
        # Log the error to get more context
        print(f"Error in generating audio for phrase '{request.text}': {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
